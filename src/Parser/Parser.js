import { Token } from '../Lexer/token';
import { Lexer } from '../Lexer/lexer';
import {ConstantNode, IntegerLiteral} from './astNodes/ConstantNode';
import { DecimalLiteral } from './astNodes/DecimalLiteral';
import { StringLiteral } from './astNodes/StringLiteral';
import { NullLiteral } from './astNodes/NullLiteral';
import { BooleanLiteral } from './astNodes/BooleanLiteral';
import { TreeNode } from './astNodes/TreeNode';
import { BinaryExpression } from './astNodes/BinaryExpression';
import { OperatorNode } from './astNodes/OperatorNode';

export class Parser {
	constructor(input) {
		this.lexer = new Lexer(input);
		this.currentToken = this.lexer.nextToken();
	}

	isAdditiveOperator() {
		return this.currentToken.type === '-' || this.currentToken.type === '+';
	}

	isMultiplyDivisionOrModuloOperator() {
		return this.currentToken.type === '*' || this.currentToken.type === '/' || this.currentToken.type === "%";
	}

	isNumber() {
		return this.currentToken.type === 'decimal' || this.currentToken.type === 'integer';
	}

	discardNewlines() {
		while (this.currentToken.type === '\n') {
			this.currentToken = this.lexer.nextToken();
		}
	}

	// parseValue(input) {
	// 	let value = null;
	// 	if (this.currentToken.type === 'integer') {
	// 		value = new IntegerLiteral(this.currentToken.value);
	// 	} if (this.currentToken.type === 'decimal') {
	// 		value = new DecimalLiteral(this.currentToken.value);
	// 	} if (this.currentToken.type === 'string') {
	// 		value = new StringLiteral(this.currentToken.value);
	// 	} if (this.currentToken.type === 'null') {
	// 		value = new NullLiteral(this.currentToken.value);
	// 	} if (this.currentToken.type === 'true') {
	// 		value = new BooleanLiteral(this.currentToken.value);
	// 	} if (this.currentToken.type === 'false') {
	// 		value = new BooleanLiteral(this.currentToken.value);
	// 	}
	// 	return value;
	// }

	parse() {
		console.log('currentToken ', this.currentToken);
		const node = this.parseAddSubtract();
		return node;
	}

	parseMultiplyDivide() {
		let node = this.parseNumber();

		while (this.isMultiplyDivisionOrModuloOperator()) {
			const name = this.currentToken.value;
			const operator = this.currentToken.type;
			this.currentToken = this.lexer.nextToken();
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

			this.currentToken = this.lexer.nextToken();
			const left = node;
			const right = this.parseMultiplyDivide();
			node = new OperatorNode(name, operator, left, right);
		}

		return node;
	}

	parseNumber() {
		if (this.isNumber()) {
			let node = new ConstantNode(this.currentToken.value, this.currentToken.type);
			this.currentToken = this.lexer.nextToken();
			return node;
		}
		// return parseParenthesis
	}
}
