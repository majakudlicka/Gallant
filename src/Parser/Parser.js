import { TokenTypes, TokenValues, TokenStructure } from '../Lexer/tokenStructure';
import { Lexer } from '../Lexer/Lexer';
import { ConstantNode } from './astNodes/ConstantNode';
import { OperatorNode } from './astNodes/OperatorNode';
import { ConditionalNode } from './astNodes/ConditionalNode';
import { WhileLoopNode } from './astNodes/WhileLoopNode';
import { AssignmentNode } from './astNodes/AssignmentNode';
import { SymbolNode } from './astNodes/SymbolNode';
import { BlockNode } from './astNodes/BlockNode';
import { ParenthesisNode } from './astNodes/ParenthesisNode';
import { FunctionCallNode } from './astNodes/FunctionCallNode';
import { FunctionDefinitionNode } from './astNodes/FunctionDefinitionNode';
import { ArrayNode } from './astNodes/ArrayNode';
import { AccessorNode } from './astNodes/AccessorNode';
import { MapNode } from './astNodes/MapNode';
import { DeAssignmentNode } from './astNodes/DeAssignmentNode';

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
		return this.currentToken.value === TokenValues.Minus || this.currentToken.value === TokenValues.Plus;
	}

	isMultiplyDivisionOrModuloOperator() {
		return !this.isAdditiveOperator() && this.currentToken.type === TokenTypes.Arithmetic;
	}

	isNumber() {
		return this.currentToken.type === TokenTypes.Decimal || this.currentToken.type === TokenTypes.Integer;
	}

	isConstant() {
		// TODO Rethink, do these need to be in a special categpry? Why?
		return ['null', 'true', 'false'].includes(this.currentToken.value);
	}

	discardNewlines() {
		while (this.currentToken.value === TokenValues.Newline) {
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
		return this.currentToken.value !== TokenValues.Newline && this.currentToken.value !== ';';
	}

	isEndOfBlock() {
		return this.currentToken.value === TokenValues.Newline || this.currentToken.value === ';';
	}

	parseBlock() {
		console.log('in parseBlock');
		let node;
		const blocks = [];
		let terminatedPolitely = false;
		if (this.isSameBlock()) {
			node = this.parseAssignment();
		}
		// If there is more than one block, start to populate blocks array
		while (this.isEndOfBlock()) {
			if (blocks.length === 0 && node) {
				blocks.push(node);
			}
			this.next();
			// Convention is to add this token at the end but if preferred can be added earlier in the block
			if (this.currentToken.type === TokenTypes.Gratitude) {
				terminatedPolitely = true;
				this.next();
			}
			if (this.currentToken.type === TokenTypes.EndOfInput) break;
			if (this.isSameBlock()) {
				node = this.parseAssignment();
				if (node) blocks.push(node);
			}
		}

		if (blocks.length > 0) {
			const { line } = this.currentToken;
			return new BlockNode(blocks, line, terminatedPolitely);
		}
		// If there was only one block, just return the current node
		return node;
	}

	parseRelational() {
		const params = [this.parseAddSubtract()];
		const conditionals = [];

		while (this.currentToken.type === TokenTypes.Comparison) {
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
		if (this.currentToken.type === TokenTypes.Greeting) {
			greeted = true;
			this.next();
		}

		const node = this.parseFunctionDefinition();

		if (this.currentToken.value === TokenValues.Assignment) {
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
		if (node && node.isSymbolNode() && this.currentToken.value === TokenValues.LeftParen) {
			const params = [];
			const { line } = this.currentToken;
			this.next();
			if (this.currentToken.value !== TokenValues.RightParen) {
				params.push(this.parseAssignment());

				// parse a list with parameters
				while (this.currentToken.value === TokenValues.Comma) {
					this.next();
					params.push(this.parseAssignment());
				}
			}
			this.expect(TokenValues.RightParen);
			this.expect(TokenValues.LeftBrace);
			const value = this.parseBlock();
			this.expect(TokenValues.RightBrace);
			return new FunctionDefinitionNode(node.name, params, value, line);
		}
		return node;
	}

	parseWhileLoop() {
		let node = this.parseConditional();
		while (this.currentToken.value === TokenValues.While) {
			this.next();
			this.expect(TokenValues.LeftParen);
			const condition = this.parseAssignment();
			this.expect(TokenValues.RightParen);
			this.expect(TokenValues.LeftBrace);
			const body = this.parseBlock();
			this.expect(TokenValues.RightBrace);
			const { line } = this.currentToken;
			node = new WhileLoopNode(condition, body, line);
		}

		return node;
	}

	parseConditional() {
		let node = this.parseRelational();

		const { line } = this.currentToken;
		while (this.currentToken.value === TokenValues.If) {
			this.next();
			let multiline = false;
			this.expect(TokenValues.LeftParen);
			const condition = this.parseRelational();
			this.expect(TokenValues.RightParen);
			if (this.currentToken.value === TokenValues.LeftBrace) {
				multiline = true;
				this.next();
			}
			const trueExpr = this.parseBlock();
			if (multiline) this.expect(TokenValues.RightBrace);
			let falseExpr = null;
			if (this.currentToken.value === TokenValues.Else) {
				this.next();
				if (multiline) this.expect(TokenValues.LeftBrace);
				falseExpr = this.parseBlock();
				if (multiline) this.expect(TokenValues.RightBrace);
			}
			node = new ConditionalNode(condition, trueExpr, falseExpr, line);
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
		if (this.currentToken.type === TokenTypes.Farewell) {
			this.next();
			const { type, value, line } = this.currentToken;
			if (type === TokenTypes.Identifier) {
				const node = new DeAssignmentNode(value, line);
				this.next();
				return node;
			} else {
				this.throwParserError('Farewell tokens can only be used with identifiers');
			}
		}
		return this.parseParentheses();
	}

	parseParentheses() {
		let node;

		// check if it is a parenthesized expression
		if (this.currentToken.value === TokenValues.LeftParen) {
			this.next();

			node = this.parseAssignment();
			const { line } = this.currentToken;
			this.expect(')');

			node = new ParenthesisNode(node, line);
			node = this.parseAccessors(node);
			return node;
		}

		// TODO: parseEnd ?
		// return this.parseEnd();
	}

	// TODO why are we passing node here
	parseAccessors(node) {
		if (this.currentToken.value === TokenValues.At) {
			this.next();
			const { line } = this.currentToken;
			// eslint-disable-next-line no-param-reassign
			return new AccessorNode(node, this.parseSymbolOrConstant(), line);
		}

		return node;
	}

	parseFunctionCall() {
		const { line, type } = this.currentToken;
		if (type === TokenTypes.FunctionInvocation) {
			this.next();
			const node = this.parseAssignment();
			const params = [];
			if (![TokenTypes.Delimiter, TokenTypes.EndOfInput].includes(this.currentToken.type)) {
				params.push(this.parseAssignment());
			}
			// parse a list with parameters
			while (this.currentToken.value === TokenValues.KeywordAnd) {
				this.next();
				params.push(this.parseAssignment());
			}
			return new FunctionCallNode(node, params, line);
		}
		return this.parseWhileLoop();
	}

	// parseEnd() {
	// 	if (this.currentToken.value === '') {
	// 		// syntax error or unexpected end of expression
	// 		throw new Error('Unexpected end of expression');
	// 	} else {
	// 		throw new Error('Value expected');
	// 	}
	// }

	parseString() {
		if (this.currentToken.type === TokenTypes.String) {
			const { line } = this.currentToken;
			const node = new ConstantNode(this.currentToken.value, this.currentToken.type, line);
			this.next();
			return node;
		}
		return this.parseArray();
	}

	parseArray() {
		if (this.currentToken.value === TokenValues.LeftBracket) {
			const { line } = this.currentToken;
			this.next();
			const content = [];
			if (this.currentToken.value !== TokenValues.RightBracket) {
				content.push(this.parseAssignment());

				while (this.currentToken.value === TokenValues.Comma) {
					this.next();
					content.push(this.parseAssignment());
				}
			}
			this.expect(TokenValues.RightBracket);
			return new ArrayNode(content, line);
		}

		return this.parseMap();
	}

	parseMap() {
		if (this.currentToken.value === TokenValues.LeftBrace) {
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
			if (this.currentToken.value !== TokenValues.RightBrace) {
				parseKeyValuePair();
				while (this.currentToken.value === TokenValues.Comma) {
					this.next();
					parseKeyValuePair();
				}
			}
			this.expect(TokenValues.RightBrace);
			return new MapNode(keyValuePairs, line);
		}

		return this.parseNumber();
	}

	parseSymbolOrConstant() {
		const {
			value, type, line
		} = this.currentToken;
		if (this.isConstant() || type === TokenTypes.CommonEmoji) {
			const node = new ConstantNode(value, type, line);
			this.next();
			return node;
		} if (this.currentToken.type === TokenTypes.Identifier) {
			let node = new SymbolNode(value, line);
			this.next();
			node = this.parseAccessors(node);
			return node;
		}
		return this.parseString();
	}
}


// TODO eslint errors
// TODO Change order of functions to make some logical sense
// TODO Test newlines and semicolons in real life && make use of them more consistent in tests
// TODO Comments
// TODO Consistent capitalisation of files
// TODO Go through all files 2-3 last times and polish them
// TODO Make readME
// TODO Introduce some sort of repl - with easy emoji selector ?
// TODO Can if-else hanlde curly braces? Add more test cases to parser / interpreter
// TODO Add program examples
// TODO Load file functionality ? https://www.smashingmagazine.com/2017/03/interactive-command-line-application-node-js/
