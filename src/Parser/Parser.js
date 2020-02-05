import { Token } from '../Lexer/token';
import { Lexer } from '../Lexer/lexer';
import { IntegerLiteral } from './astNodes/IntegerLiteral';
import { DecimalLiteral } from './astNodes/DecimalLiteral';
import { StringLiteral } from './astNodes/StringLiteral';
import { NullLiteral } from './astNodes/NullLiteral';
import { BooleanLiteral } from './astNodes/BooleanLiteral';
import { TreeNode } from "./astNodes/TreeNode";
import {BinaryExpression} from "./astNodes/BinaryExpression";

export class Parser {
	constructor(input) {
		this.lexer = new Lexer(input);
		this.currentToken = this.lexer.nextToken();
	}

	isOperator(tokenType) {
		if (tokenType === '+' || tokenType === '-' || tokenType === '*') {
			return true;
		}
		return false;
	}

	constructTree() {
		const st = [];
		let t;
		let t1;
		let t2;

		let token = this.currentToken;
		// Traverse through every character of
		// input expression
		while (token && token.type !== 'EndOfInput') {
			console.log('token in while loop ', token);

			// If operand, simply push into stack
			if (!this.isOperator(token.type)) {
				t = new TreeNode(token.value);
				st.push(t);
				console.log('puhsed ', token.value, ' to the stack');
			} else {
				t = new TreeNode(token.value);
				t1 = st.pop();	 // Remove top
				t2 = st.pop();
				t.right = t1;
				t.left = t2;
				st.push(t);
				console.log('associated operator with children and pushed to stack ', token.value);
			}

			token = this.lexer.nextToken();
		}

		console.log('t before reassignment ', t);
		// only element will be root of expression
		// tree
		t = st[st.length - 1];
		st.pop();

		return t;
	}

	parse() {
		// const expressionTree = this.constructTree();
		// console.log('tree ', expressionTree);
		this.expression = this.parseValue(this.currentToken);
		this.currentToken = this.lexer.nextToken();
		if (this.isAdditiveOperator(this.currentToken)) {
			let binaryExpression = new BinaryExpression();
			binaryExpression.operator = this.currentToken.value;
			this.currentToken = this.lexer.nextToken();
			binaryExpression.left = this.expression;
			binaryExpression.right = this.parseValue(this.currentToken);
			this.expression = binaryExpression;
		}
		console.log('expression ', this.expression);
		return this.expression;
	}

	isAdditiveOperator() {
		return this.currentToken.type === '-' || this.currentToken.type === '+';
	}

	discardNewlines() {
		while (this.currentToken.type === '\n') {
			this.currentToken = this.lexer.nextToken();
		}
	}

	parseValue(input) {
		let value = null;
		if (this.currentToken.type === 'integer') {
			value = new IntegerLiteral(this.currentToken.value);
		} if (this.currentToken.type === 'decimal') {
			value = new DecimalLiteral(this.currentToken.value);
		} if (this.currentToken.type === 'string') {
			value = new StringLiteral(this.currentToken.value);
		} if (this.currentToken.type === 'null') {
			value = new NullLiteral(this.currentToken.value);
		} if (this.currentToken.type === 'true') {
			value = new BooleanLiteral(this.currentToken.value);
		} if (this.currentToken.type === 'false') {
			value = new BooleanLiteral(this.currentToken.value);
		}
		return value;
	}

	eatWhiteSpace() {

	}
}
