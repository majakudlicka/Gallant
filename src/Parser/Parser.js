import { TokenTypes, TokenValues, TokenStructure } from "../Lexer/tokenStructure";
import { Lexer } from '../Lexer/lexer';
import { ConstantNode } from './astNodes/ConstantNode';
import { OperatorNode } from './astNodes/OperatorNode';
import { ConditionalNode } from './astNodes/ConditionalNode';
import { WhileLoopNode } from './astNodes/WhileLoopNode';
import { AssignmentNode } from './astNodes/AssignmentNode';
import { SymbolNode } from './astNodes/SymbolNode';
import { BlockNode } from './astNodes/BlockNode';
import { ParenthesisNode } from './astNodes/ParenthesisNode';
import { FunctionCallNode } from './astNodes/FunctionCallNode';
import { FunctionAssignmentNode } from './astNodes/FunctionAssignmentNode';
import { ArrayNode } from './astNodes/ArrayNode';
import { AccessorNode } from './astNodes/AccessorNode';
import { MapNode } from './astNodes/MapNode';

export class Parser {
	constructor(input) {
		this.lexer = new Lexer(input);
		this.next();
	}

	isAdditiveOperator() {
		return this.currentToken.value === TokenValues.Minus || this.currentToken.type === TokenValues.Plus;
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
		console.log('currentToken ', this.currentToken);
		const node = this.parseBlock();
		return node;
	}

	next() {
		this.currentToken = this.lexer.nextToken();
	}

	parseBlock() {
		let node;
		const blocks = [];

		if (this.currentToken.value !== ''
			&& this.currentToken.value !== TokenValues.Newline
			&& this.currentToken.value !== ';') {
			node = this.parseAssignment();
		}

		// TODO: simplify this loop
		while (this.currentToken.value === TokenValues.Newline || this.currentToken.value === ';') {
			if (blocks.length === 0 && node) {
				blocks.push(node);
			}
			this.next();
			if (this.currentToken.type === 'EndOfInput') break;
			if (this.currentToken.value !== '' && this.currentToken.value !== '\n' && this.currentToken.value !== ';') {
				node = this.parseAssignment();
				if (node) blocks.push(node);
			}
		}

		if (blocks.length > 0) {
			const { line } = this.currentToken;
			return new BlockNode(blocks, line);
		}
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
		throw new Error(`Error parsing code at line ${line}`);
	}

	parseAssignment() {
		let greeted = false;
		if (this.currentToken.type === TokenTypes.Greeting) {
			greeted = true;
			this.next();
		}
		const node = this.parseWhileLoop();

		if (this.currentToken.value === TokenValues.Assignment) {
			if (node.isSymbolNode()) {
				// parse a variable assignment
				const { name } = node;
				this.next();
				const value = this.parseAssignment();
				const { line } = this.currentToken;
				return new AssignmentNode(new SymbolNode(name, line), value, greeted, line);
			} if (node.isFunctionCallNode() && node.identifier.isSymbolNode()) {
				// parse function assignment
				let valid = true;
				const args = [];

				const { name } = node.identifier;
				node.args.forEach((arg, index) => {
					if (arg.isSymbolNode()) {
						args[index] = arg.name;
					} else {
						valid = false;
					}
				});

				if (valid) {
					this.next();
					this.expect(TokenValues.LeftBrace);
					const value = this.parseBlock();
					this.expect(TokenValues.RightBrace);
					const { line } = this.currentToken;
					return new FunctionAssignmentNode(name, args, value, greeted, line);
				}
			} if (node.isAccessorNode()) {
				this.next();
				const value = this.parseAssignment();
				const { line } = this.currentToken;
				return new AssignmentNode(node, value, greeted, line);
			}

			throw new Error('Invalid left hand side of assignment operator =');
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
			this.expect(TokenValues.LeftParen);
			const condition = this.parseRelational();
			this.expect(TokenValues.RightParen);
			const trueExpr = this.parseRelational();
			let falseExpr = null;
			if (this.currentToken.value === TokenValues.Else) {
				this.next();
				falseExpr = this.parseRelational();
			}
			node = new ConditionalNode(condition, trueExpr, falseExpr, line);
		}

		return node;
	}

	expect(tokenValue) {
		if (this.currentToken.value !== tokenValue) {
			throw new Error(`Expected '${tokenValue}' but found '${this.currentToken.value}'.`);
		}
		this.next();
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
			const {
				value, type, line
			} = this.currentToken;
			const node = new ConstantNode(value, type, line);
			this.next();
			return node;
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

			if (this.currentToken.value !== TokenValues.RightParen) {
				throw new Error('Parenthesis ) expected');
			}
			this.next();

			node = new ParenthesisNode(node, line);
			node = this.parseAccessors(node);
			return node;
		}

		// return this.parseEnd();
	}

	parseAccessors(node) {
		let params;

		while (this.currentToken.value === '(' || this.currentToken.value === '@' || this.currentToken.value === '.') {
			params = [];

			if (this.currentToken.value === '(') {
				// function invocation like fn(2, 3) or obj.fn(2, 3)
				this.next();

				if (this.currentToken.value !== ')') {
					params.push(this.parseAssignment());

					// parse a list with parameters
					while (this.currentToken.value === ',') {
						this.next();
						params.push(this.parseAssignment());
					}
				}

				if (this.currentToken.value !== ')') {
					throw new Error('Parenthesis ) expected');
				}
				this.next();
				const { line } = this.currentToken;

				// eslint-disable-next-line no-param-reassign
				node = new FunctionCallNode(node, params, line);
				// TODO
			} else if (this.currentToken.value === '@') {
				this.next();
				const { line } = this.currentToken;
				// eslint-disable-next-line no-param-reassign
				node = new AccessorNode(node, this.parseSymbolOrConstant(), line);
			}
		}

		return node;
	}

	parseEnd() {
		if (this.currentToken.value === '') {
			// syntax error or unexpected end of expression
			throw new Error('Unexpected end of expression');
		} else {
			throw new Error('Value expected');
		}
	}

	parseString() {
		if (this.currentToken.type === 'string') {
			const { line } = this.currentToken;
			const node = new ConstantNode(this.currentToken.value, this.currentToken.type, line);
			this.next();
			return node;
		}
		return this.parseArray();
	}

	parseArray() {
		if (this.currentToken.value === '[') {
			const { line } = this.currentToken;
			this.next();
			const content = [];
			if (this.currentToken.value !== ']') {
				content.push(this.parseAssignment());

				while (this.currentToken.value === ',') {
					this.next();
					content.push(this.parseAssignment());
				}
			}
			this.expect(']');
			return new ArrayNode(content, line);
		}

		return this.parseMap();
	}

	parseMap() {
		if (this.currentToken.value === '{') {
			const { line } = this.currentToken;
			this.next();
			const keyValuePairs = [];
			if (this.currentToken.value !== '}') {
				const { symbol, value } = this.parseAssignment();
				if (!symbol || !value) {
					throw new Error('Syntax error parsing map');
				}
				keyValuePairs.push([symbol, value]);
				while (this.currentToken.value === ',') {
					this.next();
					// TODO: refactor to avoid duplicating code
					const { symbol, value } = this.parseAssignment();
					if (!symbol || !value) {
						throw new Error('Syntax error parsing map');
					}
					keyValuePairs.push([symbol, value]);
				}
			}
			this.expect('}');
			return new MapNode(keyValuePairs, line);
		}

		return this.parseNumber();
	}

	parseSymbolOrConstant() {
		const {
			value, type, line
		} = this.currentToken;
		if (this.isConstant()) {
			const node = new ConstantNode(value, type, line);
			this.next();
			return node;
		} if (this.currentToken.type === 'identifier') {
			let node = new SymbolNode(value, line);
			this.next();
			node = this.parseAccessors(node);
			return node;
		}
		return this.parseString();
	}
}

// TODO use TokenType mappings
// TODO eslint errors
// TODO sync parser to lexer and compiler
// TODO Figure out why row & column are not working
// TODO Add 'hi' and 'hello' as keywords to introduce new vars
// TODO Add more info to errors (error logging method incl currentToken, line, col
// TODO Use destructuring in Nodes constructors
// TODO Rename Function assignment to function definition and function to function call (or something like that)
// TODO Change order of functions to make some logical sense
// TODO Do we need RelationalNode type ?
// TODO Change strings to use $
// TODO Console.log some mirror related phrasem (mirror, mirror, on the wall...)
// TODO introduce ; and sort out strange issues with new lines
// TODO Replace hardcoded tokens with .tokentype
// TODO Do we use keyword func or this
