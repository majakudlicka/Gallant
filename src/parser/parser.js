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

	parse() {
		return this.parseBlock();
	}

	next() {
		this.currentToken = this.lexer.nextToken();
	}

	isSameBlock() {
		return this.currentToken.value !== TV.Newline && this.currentToken.value !== ';';
	}

	isEndOfBlock() {
		return this.currentToken.value === TV.Newline || this.currentToken.value === ';';
	}

	isTerminatedWithCurlyBrace(node) {
		return node && (node.isFunctionDefinitionNode()
			|| node.isWhileLoopNode()
			|| (node.isConditionalNode() && node.multiline));
	}

	parseBlock() {
		let node;
		let lastparsedNode;
		const blocks = [];
		let terminatedPolitely = false;
		if (this.isSameBlock()) {
			node = this.parseAssignment();
		}
		// If there is more than one block, start to populate blocks array
		while (this.isEndOfBlock() || this.isTerminatedWithCurlyBrace(lastparsedNode)) {
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
				lastparsedNode = node;
			}
		}

		if (blocks.length > 1) {
			const { line } = this.currentToken;
			return new BlockNode(blocks, line, terminatedPolitely);
		} if (blocks.length === 1) {
			return blocks[0];
		}
		// If there was only one block, just return the current node
		return node;
	}

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
			if (node.isSymbolNode()) {
				// parse a variable assignment
				const { name } = node;
				this.next();
				const value = this.parseAssignment();
				const { line } = this.currentToken;
				return new AssignmentNode(new SymbolNode(name, line), value, greeted, line);
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
				if (multiline) this.expect(TV.LeftBrace);
				falseExpr = this.parseBlock();
				if (multiline) this.expect(TV.RightBrace);
			}
			node = new ConditionalNode(condition, trueExpr, falseExpr, multiline, line);
		}

		return node;
	}

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

	parseNumber() {
		if (this.isNumber()) {
			const { value, type, line } = this.currentToken;
			const node = new ConstantNode(value, type, line);
			this.next();
			return node;
		}
		return this.parseFarewell();
	}

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
			return node;
		}

	}

	// TODO Can this be done without passing node
	parseAccessors(node) {
		if (this.currentToken.value === TV.At) {
			this.next();
			const { line } = this.currentToken;
			// eslint-disable-next-line no-param-reassign
			return new AccessorNode(node, this.parseSymbolOrConstant(), line);
		}

		return node;
	}

	parseFunctionCall() {
		const { line, type } = this.currentToken;
		if (type === TT.FunctionInvocation) {
			this.next();
			const node = this.parseAssignment();
			const params = [];
			if (![TT.Delimiter, TT.EndOfInput].includes(this.currentToken.type)) {
				params.push(this.parseAssignment());
			}
			// parse a list with parameters
			while (this.currentToken.value === TV.KeywordAnd) {
				this.next();
				params.push(this.parseAssignment());
			}
			return new FunctionCallNode(node, params, line);
		}
		return this.parseWhileLoop();
	}

	parseString() {
		if (this.currentToken.type === TT.String) {
			const { line } = this.currentToken;
			const node = new ConstantNode(this.currentToken.value, this.currentToken.type, line);
			this.next();
			return node;
		}
		return this.parseArray();
	}

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
}


// TODO eslint errors
// TODO Comments
// TODO Go through all files 2-3 last times and polish them
// TODO Add program examples
