import { TokenStructure as TS, TokenTypes as TT, TokenValues as TV } from '../lexer/tokenStructure';
import { Lexer } from '../lexer/lexer';
import { ConstantNode } from './astNodes/constantNode';
import { OperatorNode } from './astNodes/operatorNode';
import { ConditionalNode } from './astNodes/conditionalNode';
import { WhileLoopNode } from './astNodes/whileLoopNode';
import { AssignmentNode } from './astNodes/assignmentNode';
import { SymbolNode } from './astNodes/symbolNode';
import { BlockNode } from './astNodes/blockNode';
import { ParenthesisNode } from './astNodes/parenthesisNode';
import { FunctionCallNode } from './astNodes/functionCallNode';
import { FunctionDefinitionNode } from './astNodes/functionDefinitionNode';
import { ArrayNode } from './astNodes/arrayNode';
import { AccessorNode } from './astNodes/accessorNode';
import { MapNode } from './astNodes/mapNode';
import { DeAssignmentNode } from './astNodes/deAssignmentNode';

export class Parser {
	constructor(input) {
		this.lexer = new Lexer(input);
		this.next();
	}

	parse() {
		return this.parseBlock();
	}

	next() {
		this.currentToken = this.lexer.nextToken();
	}

	throwParserError(message = 'Error parsing code') {
		throw new Error(`[PARSER]: ${message} at line ${this.currentToken.line}`);
	}

	expect(tokenValue) {
		if (this.currentToken.value !== tokenValue) {
			throw new Error(`[PARSER]: Expected '${tokenValue}' but found '${this.currentToken.value} 
			at line ${this.currentToken.line}'`);
		}
		this.next();
	}

	isAdditiveOperator() {
		return this.currentToken.value === TV.Minus || this.currentToken.value === TV.Plus;
	}

	isMultiplyDivisionOrModuloOperator() {
		return !this.isAdditiveOperator() && this.currentToken.type === TT.Arithmetic;
	}

	isNumber() {
		return this.currentToken.type === TT.Decimal || this.currentToken.type === TT.Integer;
	}

	isConstant() {
		return Object.values(TS.Constant.values).includes(this.currentToken.value);
	}

	discardNewlines() {
		while (this.currentToken.value === TV.Newline) {
			this.next();
		}
	}

	isSameBlock() {
		return this.currentToken.value !== TV.Newline && this.currentToken.value !== ';';
	}

	isEndOfBlock() {
		return !this.isSameBlock();
	}

	isTerminatedWithCurlyBrace(node) {
		return node && (node.isFunctionDefinitionNode()
			|| node.isWhileLoopNode()
			|| (node.isConditionalNode() && node.multiline));
	}

	// Parse code block
	parseBlock() {
		let node;
		let lastParsedNode;
		const blocks = [];
		let terminatedPolitely = false;
		if (this.isSameBlock()) {
			node = this.parseAssignment();
		}
		// If there is more than one block, start to populate blocks array
		// Account for the case when there is no newline after curly brace (useful for repl)
		while (this.isEndOfBlock() || this.isTerminatedWithCurlyBrace(lastParsedNode)) {
			if (blocks.length === 0 && node) {
				blocks.push(node);
			}
			if (this.isEndOfBlock()) this.next();
			// Convention is to add this token at the end but if preferred can be added earlier in the block
			if (this.currentToken.type === TT.Gratitude) {
				terminatedPolitely = true;
				this.next();
			}
			if (this.currentToken.type === TT.EndOfInput) break;
			if (this.isSameBlock()) {
				node = this.parseAssignment();
				if (node) blocks.push(node);
				lastParsedNode = node;
			}
		}

		if (blocks.length > 1) {
			const { line } = this.currentToken;
			return new BlockNode(blocks, line, terminatedPolitely);
		} if (blocks.length === 1) {
			// This is the case when we assumed there are going to be more blocks (because of block-ending delimiter)
			// But the assumption turned out wrong. Don't create a block node, just return the current node
			return blocks[0];
		}
		// One line statement, just return the current node
		return node;
	}

	// Parse assignment (lowest operator precedence)
	parseAssignment() {
		// "Greeting" is essentially an equivalent of declaring variables in other languages
		// All variables need to be "greeted" (declared)
		let greeted = false;
		if (this.currentToken.type === TT.Greeting) {
			greeted = true;
			this.next();
		}

		const node = this.parseFunctionDefinition();

		if (this.currentToken.value === TV.Assignment) {
			// Left side of an assignment is a symbol
			if (node.isSymbolNode()) {
				// parse a variable assignment
				const { name } = node;
				this.next();
				const value = this.parseAssignment();
				const { line } = this.currentToken;
				return new AssignmentNode(new SymbolNode(name, line), value, greeted, line);
				// Left side of an assignment is an accessor node
				// Used to modify elements inside maps or arrays
			} if (node.isAccessorNode()) {
				this.next();
				const value = this.parseAssignment();
				const { line } = this.currentToken;
				return new AssignmentNode(node, value, greeted, line);
			}
			return this.throwParserError();
		}

		return node;
	}

	// Parse function declaration
	parseFunctionDefinition() {
		const node = this.parseFunctionCall();
		if (node && node.isSymbolNode() && this.currentToken.value === TV.LeftParen) {
			const params = [];
			const { line } = this.currentToken;
			this.next();
			if (this.currentToken.value !== TV.RightParen) {
				params.push(this.parseAssignment());

				// parse a list with parameters
				while (this.currentToken.value === TV.Comma) {
					this.next();
					params.push(this.parseAssignment());
				}
			}
			this.expect(TV.RightParen);
			this.expect(TV.LeftBrace);
			const value = this.parseBlock();
			this.expect(TV.RightBrace);
			return new FunctionDefinitionNode(node.name, params, value, line);
		}
		return node;
	}

	// Parse function invocation
	// Function invocation is performed using one of the "plead" tokens
	parseFunctionCall() {
		const { line, type } = this.currentToken;
		if (type === TT.Plead) {
			this.next();
			const node = this.parseAssignment();
			const params = [];
			if (![TT.Delimiter, TT.EndOfInput].includes(this.currentToken.type)) {
				params.push(this.parseAssignment());
			}
			// parse a list of parameters
			while (this.currentToken.value === TV.KeywordAnd) {
				this.next();
				params.push(this.parseAssignment());
			}
			return new FunctionCallNode(node, params, line);
		}
		return this.parseWhileLoop();
	}

	// Parse while loop
	parseWhileLoop() {
		let node = this.parseConditional();
		while (this.currentToken.value === TV.While) {
			this.next();
			this.expect(TV.LeftParen);
			const condition = this.parseAssignment();
			this.expect(TV.RightParen);
			this.expect(TV.LeftBrace);
			const body = this.parseBlock();
			this.expect(TV.RightBrace);
			const { line } = this.currentToken;
			node = new WhileLoopNode(condition, body, line);
		}

		return node;
	}

	// Parse if else statements
	// Supports two variants of acceptable syntax - single-line and multi-line
	parseConditional() {
		let node = this.parseRelational();

		const { line } = this.currentToken;
		while (this.currentToken.value === TV.If) {
			this.next();
			let multiline = false;
			this.expect(TV.LeftParen);
			const condition = this.parseRelational();
			this.expect(TV.RightParen);
			if (this.currentToken.value === TV.LeftBrace) {
				multiline = true;
				this.next();
			}
			const trueExpr = this.parseBlock();
			if (multiline) this.expect(TV.RightBrace);
			let falseExpr = null;
			if (this.currentToken.value === TV.Else) {
				this.next();
				if (multiline) {
					this.expect(TV.LeftBrace);
					falseExpr = this.parseBlock();
					this.expect(TV.RightBrace);
				} else {
					falseExpr = this.parseAssignment();
				}
			}
			node = new ConditionalNode(condition, trueExpr, falseExpr, multiline, line);
		}

		return node;
	}

	// Parse (relational) comparison statements
	parseRelational() {
		const params = [this.parseAddSubtract()];
		const conditionals = [];

		while (this.currentToken.type === TT.Comparison) {
			const cond = { fn: this.currentToken.value };
			conditionals.push(cond);
			this.next();
			params.push(this.parseAddSubtract());
		}
		const { line } = this.currentToken;
		if (params.length === 1) {
			return params[0];
		} if (params.length === 2) {
			return new OperatorNode(conditionals[0].fn, params[0], params[1], line);
		}
		return this.throwParserError();
	}

	// Parse add and subtract operations
	parseAddSubtract() {
		let node = this.parseMultiplyDivide();
		const { line } = this.currentToken;

		while (this.isAdditiveOperator()) {
			const operator = this.currentToken.value;
			this.next();
			const left = node;
			const right = this.parseMultiplyDivide();
			node = new OperatorNode(operator, left, right, line);
		}

		return node;
	}

	// Parse multiple, divide and modulo operations
	parseMultiplyDivide() {
		let node = this.parseSymbolOrConstant();
		const { line } = this.currentToken;

		while (this.isMultiplyDivisionOrModuloOperator()) {
			const operator = this.currentToken.value;
			this.next();
			const left = node;
			const right = this.parseSymbolOrConstant();
			node = new OperatorNode(operator, left, right, line);
		}

		return node;
	}

	// Parse symbol (identifier) or constant
	parseSymbolOrConstant() {
		const {
			value, type, line
		} = this.currentToken;
		if (this.isConstant() || type === TT.CommonEmoji) {
			const node = new ConstantNode(value, type, line);
			this.next();
			return node;
		} if (this.currentToken.type === TT.Identifier) {
			let node = new SymbolNode(value, line);
			this.next();
			node = this.parseAccessors(node);
			return node;
		}
		return this.parseString();
	}

	// Parse string. Only double quotes are supported
	parseString() {
		if (this.currentToken.type === TT.String) {
			const { line } = this.currentToken;
			const node = new ConstantNode(this.currentToken.value, this.currentToken.type, line);
			this.next();
			return node;
		}
		return this.parseArray();
	}

	// Parse array
	parseArray() {
		if (this.currentToken.value === TV.LeftBracket) {
			const { line } = this.currentToken;
			this.next();
			const content = [];
			if (this.currentToken.value !== TV.RightBracket) {
				content.push(this.parseAssignment());

				while (this.currentToken.value === TV.Comma) {
					this.next();
					content.push(this.parseAssignment());
				}
			}
			this.expect(TV.RightBracket);
			return new ArrayNode(content, line);
		}

		return this.parseMap();
	}

	// Parse map (object)
	parseMap() {
		if (this.currentToken.value === TV.LeftBrace) {
			const { line } = this.currentToken;
			this.next();
			const keyValuePairs = [];
			const parseKeyValuePair = () => {
				const { symbol, value } = this.parseAssignment();
				if (!symbol || !value) {
					this.throwParserError('Syntax error parsing map');
				}
				keyValuePairs.push([symbol, value]);
			};
			if (this.currentToken.value !== TV.RightBrace) {
				parseKeyValuePair();
				while (this.currentToken.value === TV.Comma) {
					this.next();
					parseKeyValuePair();
				}
			}
			this.expect(TV.RightBrace);
			return new MapNode(keyValuePairs, line);
		}

		return this.parseNumber();
	}

	// Parse number - integer or decimal
	parseNumber() {
		if (this.isNumber()) {
			const { value, type, line } = this.currentToken;
			const node = new ConstantNode(value, type, line);
			this.next();
			return node;
		}
		return this.parseFarewell();
	}

	// Parse variable deassignment
	// Free up memory from unused values
	parseFarewell() {
		if (this.currentToken.type === TT.Farewell) {
			this.next();
			const { type, value, line } = this.currentToken;
			if (type === TT.Identifier) {
				const node = new DeAssignmentNode(value, line);
				this.next();
				return node;
			}
			this.throwParserError('Farewell tokens can only be used with identifiers');

		}
		return this.parseParentheses();
	}

	// Parse parenthesized expressions
	parseParentheses() {
		let node;

		// check if it is a parenthesized expression
		if (this.currentToken.value === TV.LeftParen) {
			this.next();

			node = this.parseAssignment();
			const { line } = this.currentToken;
			this.expect(')');

			node = new ParenthesisNode(node, line);
			node = this.parseAccessors(node);
		}
		return node;
	}

	// Parse accessors - statements accessing an elements inside of array or map
	parseAccessors(node) {
		if (this.currentToken.value === TV.At) {
			this.next();
			const { line } = this.currentToken;
			return new AccessorNode(node, this.parseSymbolOrConstant(), line);
		}

		return node;
	}
}
