import { Token } from '../Lexer/token';
import { Lexer } from '../Lexer/lexer';
import { ConstantNode } from './astNodes/ConstantNode';
import { OperatorNode } from './astNodes/OperatorNode';
import { ConditionalNode } from './astNodes/ConditionalNode';
import { WhileLoopNode } from './astNodes/WhileLoopNode';
import { AssignmentNode } from './astNodes/AssignmentNode';
import { SymbolNode } from './astNodes/SymbolNode';
import { BlockNode } from './astNodes/BlockNode';

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
		const node = this.parseBlock();
		return node;
	}

	next() {
		this.currentToken = this.lexer.nextToken();
	}

	parseBlock() {
		let node;
		const blocks = [];

		if (this.currentToken.value !== '' && this.currentToken.value !== '\n' && this.currentToken.value !== ';') {
			node = this.parseAssignment();
		}

		// TODO: simplify this loop
		while (this.currentToken.value === '\n' || this.currentToken.value === ';') {
			if (blocks.length === 0 && node) {
				blocks.push(node);
			}
			this.next();
			if (this.currentToken.type === 'EndOfInput') break;
			if (this.currentToken.value !== '' && this.currentToken.value !== '\n' && this.currentToken.value !== ';') {
				node = this.parseAssignment();
				blocks.push(node);
			}
		}

		if (blocks.length > 0) {
			return new BlockNode(blocks);
		}
		return node;
	}

	parseAssignment() {
		const node = this.parseWhileLoop();

		if (this.currentToken.value === '=') {
			if (node.isSymbolNode()) {
				// parse a variable assignment like 'a = 2/3'
				const { name } = node;
				this.next();
				const value = this.parseAssignment();
				return new AssignmentNode(new SymbolNode(name), value);
			}

			throw new Error('Invalid left hand side of assignment operator =');
		}

		return node;
	}

	parseWhileLoop() {
		let node = this.parseConditional();

		while (this.currentToken.type === 'while') {
			this.next();
			this.expect('(');
			const condition = this.parseSymbolOrConstant();
			this.expect(')');
			const body = this.parseSymbolOrConstant();
			node = new WhileLoopNode(condition, body);
		}

		return node;
	}

	parseConditional() {
		let node = this.parseSymbolOrConstant();

		while (this.currentToken.type === 'if') {
			this.next();
			this.expect('(');
			const condition = this.parseSymbolOrConstant();
			this.expect(')');
			const trueExpr = this.parseSymbolOrConstant();
			let falseExpr = null;
			if (this.currentToken.type === 'else') {
				this.next();
				falseExpr = this.parseSymbolOrConstant();
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
		console.log('currentToken is ', this.currentToken);
		// return 'Oi-oi';
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
	// Rename symbol to indentifier?
	parseSymbolOrConstant() {
		if (this.isConstant()) {
			const node = new ConstantNode(this.currentToken.value, this.currentToken.type);
			this.next();
			return node;
		} if (this.currentToken.type === 'identifier') {
			const node = new SymbolNode(this.currentToken.value);
			this.next();
			return node;
		}
		return this.parseString();
	}
}

// TODO use TokenType mappings
