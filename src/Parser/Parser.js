import { Token } from '../Lexer/token';
import { Lexer } from '../Lexer/lexer';
import { ConstantNode } from './astNodes/ConstantNode';
import { OperatorNode } from './astNodes/OperatorNode';
import { ConditionalNode } from './astNodes/ConditionalNode';
import { WhileLoopNode } from './astNodes/WhileLoopNode';
import { AssignmentNode } from './astNodes/AssignmentNode';
import { SymbolNode } from './astNodes/SymbolNode';
import { BlockNode } from './astNodes/BlockNode';
import { ParenthesisNode } from './astNodes/ParenthesisNode';
import { FunctionNode } from './astNodes/FunctionNode';
import { FunctionAssignmentNode } from './astNodes/FunctionAssignmentNode';
import { RelationalNode } from './astNodes/RelationalNode';

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

	parseRelational() {
		const params = [this.parseSymbolOrConstant()];
		const conditionals = [];

		const operators = {
			'==': 'equal',
			'!=': 'unequal',
			'<': 'smaller',
			'>': 'larger',
			'<=': 'smallerEq',
			'>=': 'largerEq'
		};

		while (operators[this.currentToken.value]) {
			const cond = { name: this.currentToken.value, fn: operators[this.currentToken.value] };
			conditionals.push(cond);
			this.next();
			params.push(this.parseSymbolOrConstant());
		}

		if (params.length === 1) {
			return params[0];
		} if (params.length === 2) {
			return new OperatorNode(conditionals[0].name, conditionals[0].fn, params[0], params[1]);
		}
		return new RelationalNode(conditionals.map(c => c.fn), params);

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
			} if (node.isFunctionNode() && node.identifier.isSymbolNode()) {
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
					// getTokenSkipNewline(state)
					this.next();
					this.expect('{');
					const value = this.parseBlock();
					this.expect('}');
					return new FunctionAssignmentNode(name, args, value);
				}
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
		let node = this.parseRelational();

		while (this.currentToken.type === 'if') {
			this.next();
			this.expect('(');
			const condition = this.parseRelational();
			this.expect(')');
			const trueExpr = this.parseRelational();
			let falseExpr = null;
			if (this.currentToken.type === 'else') {
				this.next();
				falseExpr = this.parseRelational();
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
		return this.parseParentheses();
	}

	parseParentheses() {
		let node;

		// check if it is a parenthesized expression
		if (this.currentToken.value === '(') {
			this.next();

			node = this.parseAssignment();

			if (this.currentToken.value !== ')') {
				throw new Error('Parenthesis ) expected');
			}
			this.next();

			node = new ParenthesisNode(node);
			node = this.parseAccessors(node);
			return node;
		}

		// return this.parseEnd();
	}

	parseAccessors(node) {
		let params;

		while (this.currentToken.value === '(' || this.currentToken.value === '[' || this.currentToken.value === '.') {
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

				// eslint-disable-next-line no-param-reassign
				node = new FunctionNode(node, params);
			} else if (this.currentToken.value === '[') {
				// index notation like variable[2, 3]
				// this.next();
				//
				// if (this.currentToken.value !== ']') {
				// 	params.push(this.parseAssignment())
				//
				// 	// parse a list with parameters
				// 	while (this.currentToken.value === ',') { // eslint-disable-line no-unmodified-loop-condition
				// 		this.next();
				// 		params.push(this.parseAssignment())
				// 	}
				// }
				//
				// if (this.currentToken.value !== ']') {
				// 	throw createSyntaxError(state, 'Parenthesis ] expected')
				// }
				// closeParams(state)
				// getToken(state)
				//
				// node = new AccessorNode(node, new IndexNode(params))
			} else {
				console.log('IN ELSE IN PARSEACCESSORS');
				// dot notation like variable.prop
				// getToken(state)
				//
				// if (this.currentToken.valueType !== TOKENTYPE.SYMBOL) {
				// 	throw createSyntaxError(state, 'Property name expected after dot')
				// }
				// params.push(new ConstantNode(this.currentToken.value))
				// getToken(state)
				//
				// const dotNotation = true
				// node = new AccessorNode(node, new IndexNode(params, dotNotation))
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
			const node = new ConstantNode(this.currentToken.value, this.currentToken.type);
			this.next();
			return node;
		}
		return this.parseAddSubtract();
	}

	parseSymbolOrConstant() {
		if (this.isConstant()) {
			const node = new ConstantNode(this.currentToken.value, this.currentToken.type);
			this.next();
			return node;
		} if (this.currentToken.type === 'identifier') {
			let node = new SymbolNode(this.currentToken.value);
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
// TODO Add all isBlahNode props to basic Ast node
// TODO Figure out why row & column are not working
// TODO Add 'hi' and 'hello' as keywords to introduce new vars
// TODO Add support for objects
// TODO Add support for arrays
// TODO Add support for functions
// TODO Add more info to errors (error logging method incl currentToken, line, col
// TODO Use destructuring in Nodes constructors
// TODO Rename Function assignment to function definition and function to function call (or something like that)
// TODO Change order of functions to make some logical sense
// TODO Do we need RelationalNode type ?
// TODO Change strings to use $
// TODO Console.log some mirror related phrasem (mirror, mirror, on the wall...)
