import { Token } from '../Lexer/token';
import { Lexer } from '../Lexer/lexer';
import { ConstantNode } from './astNodes/ConstantNode';
import { OperatorNode } from './astNodes/OperatorNode';
import { ConditionalNode } from './astNodes/ConditionalNode';
import {WhileLoopNode} from "./astNodes/WhileLoopNode";

export class Parser {
	constructor(input) {
		this.lexer = new Lexer(input);
		this.next();
	}

	isAdditiveOperator() {
		return this.currentToken.type === '-' || this.currentToken.type === '+';
	}

	isMultiplyDivisionOrModuloOperator() {
		return this.currentToken.type === '*' || this.currentToken.type === '/' || this.currentToken.type === '%';
	}

	isNumber() {
		return this.currentToken.type === 'decimal' || this.currentToken.type === 'integer';
	}

	isConstant() {
		return ['null', 'true', 'false'].includes(this.currentToken.type);
	}

	discardNewlines() {
		while (this.currentToken.type === '\n') {
			this.next();
		}
	}

	parse() {
		console.log('currentToken ', this.currentToken);
		const node = this.parseWhileLoop();
		return node;
	}

	next() {
		this.currentToken = this.lexer.nextToken();
	}

	parseAssignment() {
		let name, args, value, valid

		const node = this.parseWhileLoop();

		if (this.currentToken.value === '=') {
			if (isSymbolNode(node)) {
				// parse a variable assignment like 'a = 2/3'
				name = node.name
				getTokenSkipNewline(state)
				value = parseAssignment(state)
				return new AssignmentNode(new SymbolNode(name), value)
			} else if (isAccessorNode(node)) {
				// parse a matrix subset assignment like 'A[1,2] = 4'
				getTokenSkipNewline(state)
				value = parseAssignment(state)
				return new AssignmentNode(node.object, node.index, value)
			} else if (isFunctionNode(node) && isSymbolNode(node.fn)) {
				// parse function assignment like 'f(x) = x^2'
				valid = true
				args = []

				name = node.name
				node.args.forEach(function (arg, index) {
					if (isSymbolNode(arg)) {
						args[index] = arg.name
					} else {
						valid = false
					}
				})

				if (valid) {
					getTokenSkipNewline(state)
					value = parseAssignment(state)
					return new FunctionAssignmentNode(name, args, value)
				}
			}

			throw createSyntaxError(state, 'Invalid left hand side of assignment operator =')
		}

		return node
	}

	parseWhileLoop() {
		let node = this.parseConditional();

		while (this.currentToken.type === 'while') {
			this.next();
			this.expect('(');
			const condition = this.parseConstant();
			this.expect(')');
			const body = this.parseConstant();
			node = new WhileLoopNode(condition, body);
		}

		return node;
	}

	parseConditional() {
		let node = this.parseConstant();

		while (this.currentToken.type === 'if') {
			this.next();
			this.expect('(');
			const condition = this.parseConstant();
			this.expect(')');
			const trueExpr = this.parseConstant();
			let falseExpr = null;
			if (this.currentToken.type === 'else') {
				this.next();
				falseExpr = this.parseConstant();
			}
			node = new ConditionalNode(condition, trueExpr, falseExpr);
		}

		return node;
	}

	expect(tokenType) {
		// this.next();
		if (this.currentToken.type !== tokenType) {
			throw new Error(`Expected '${tokenType}' but found '${this.currentToken.value}'.`);
		}
		this.next();
		// if (tokenType !== '/n') {
		// 	this.discardNewlines();
		// }
		//
		// let token = new Token(this.currentToken.type, this.currentToken.value, this.currentToken.line, this.currentToken.column);
		//
		// if (tokenType !== TokenType.EndOfInput && token.type === TokenType.EndOfInput) {
		// 	throw new Error(Report.error(token.line, token.column, `Expected '${tokenType}' but reached end of input.`));
		// }
		//
		// if (token.type !== tokenType) {
		// 	throw new Error(Report.error(token.line, token.column, `Expected '${tokenType}' but found '${token.value}'.`));
		// }
	}

	parseMultiplyDivide() {
		let node = this.parseNumber();

		while (this.isMultiplyDivisionOrModuloOperator()) {
			const name = this.currentToken.value;
			const operator = this.currentToken.type;
			this.next();
			const left = node;
			const right = this.parseNumber();
			node = new OperatorNode(name, operator, left, right);
		}

		return node;
	}

	parseAddSubtract() {
		let node = this.parseMultiplyDivide();

		while (this.isAdditiveOperator()) {
			const name = this.currentToken.value;
			const operator = this.currentToken.type;

			this.next();
			const left = node;
			const right = this.parseMultiplyDivide();
			node = new OperatorNode(name, operator, left, right);
		}

		return node;
	}

	parseNumber() {
		if (this.isNumber()) {
			const node = new ConstantNode(this.currentToken.value, this.currentToken.type);
			this.next();
			return node;
		}
		return 'Oi-oi';
		// return parseParenthesis
	}

	parseString() {
		if (this.currentToken.type === 'string') {
			const node = new ConstantNode(this.currentToken.value, this.currentToken.type);
			this.next();
			return node;
		}
		return this.parseAddSubtract();
	}

	// Can this be combined with the string ?
	parseConstant() {
		if (this.isConstant()) {
			const node = new ConstantNode(this.currentToken.value, this.currentToken.type);
			this.next();
			return node;
		}
		return this.parseString();
	}
}
