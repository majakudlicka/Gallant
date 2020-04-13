import get from 'lodash.get';
import { Parser } from '../parser/parser';
import { SymbolTable } from '../symbol-table/symbol-table';
import { TokenTypes } from '../lexer/tokenStructure';
import jokes from '../jokes';

export class Interpreter {
	constructor(input) {
		this.parser = new Parser(input);
		this.symbolTable = new SymbolTable();
		this.ast = this.parser.parse();
	}

	interpret() {
		if (!this.ast) return null;
		if (this.ast.isBlockNode() && !this.ast.terminatedPolitely) {
			// Throw error if a code block does not end with a token type gratitude
			return this.throwIntrepreterError('last', 'Code blocks need to finish with an expression of gratitude');
		}
		return this.interpretNode(this.ast);
	}

	// Helper function for signaling errors
	throwIntrepreterError(line, message = 'Unknown error') {
		if (message.includes('[INTERPRETER]')) throw new Error(message);
		let msg;
		if (line === 'last') msg = `[INTERPRETER]: Syntax error around ${line} line: ${message}`;
		else msg = `[INTERPRETER]: Syntax error around line ${line}: ${message}`;
		throw new Error(msg);
	}

	interpretNode(node) {
		if (node.isConstantNode()) {
			return this.interpretConstantNode(node);
		}
		if (node.isParenthesisNode()) {
			return this.interpretParenthesisNode(node);
		}
		if (node.isAssignmentNode()) {
			return this.interpretAssignmentNode(node);
		}
		if (node.isFunctionDefinitionNode()) {
			return this.interpretFunctionDefinitionNode(node);
		}
		if (node.isConditionalNode()) {
			return this.interpretConditionalNode(node);
		}
		if (node.isFunctionCallNode()) {
			return this.interpretFunctionCall(node);
		}
		if (node.isBlockNode()) {
			return this.interpretBlockNode(node);
		}
		if (node.isSymbolNode()) {
			return this.interpretSymbolNode(node);
		}
		if (node.isOperatorNode()) {
			return this.interpretOperatorNode(node);
		}
		if (node.isWhileLoopNode()) {
			return this.interpretWhileLoopNode(node);
		}
		if (node.isArrayNode()) {
			return this.interpretArrayNode(node);
		}
		if (node.isAccessorNode()) {
			return this.interpretAccessorNode(node);
		}
		if (node.isMapNode()) {
			return this.interpretMapNode(node);
		}
		if (node.isDeAssignmentNode()) {
			return this.interpretDeAssignmentNode(node);
		}
		return this.throwIntrepreterError(node.line);
	}

	// Interpret block node
	interpretBlockNode(node) {
		const size = node.blocks.length;
		for (let i = 0; i < size - 1; i++) {
			this.interpretNode(node.blocks[i]);
		}
		return this.interpretNode(node.blocks[size - 1]);
	}

	// Interpret map
	interpretMapNode(node) {
		const m = new Map();
		if (!node.keyValuePairs || !Array.isArray(node.keyValuePairs)) {
			return this.throwIntrepreterError(node.line, 'Error interpreting map');
		}
		node.keyValuePairs.forEach(([s, v]) => {
			const symbol = s.name;
			const value = this.interpretNode(v);
			m.set(symbol, value);
		});
		return m;
	}

	// Interpret array
	interpretArrayNode(node) {
		if (!node.content || !Array.isArray(node.content)) {
			return this.throwIntrepreterError(node.line, 'Error interpreting array');
		}
		const res = [];
		node.content.forEach(childNode => {
			res.push(this.interpretNode(childNode));
		});
		return res;
	}

	// Interpret an expression accessing an element in array or map
	interpretAccessorNode(node) {
		// Reference can be an array or a map
		const reference = this.interpretNode(node.ref);
		if (reference === undefined) {
			return this.throwIntrepreterError(node.line,
				'Array or map you are trying to access does not exist in the current scope');
		}
		try {
			const isArray = Array.isArray(reference);
			// Handle special case of "size" keyword
			if (get(node, 'key.name') === 'size') {
				return isArray ? reference.length : reference.size;
			}
			// Return element of the array at given index
			if (isArray) {
				const index = this.interpretNode(node.key);
				return reference[index];
			}
			// Return map element for given key
			const key = node.key && node.key.name;
			return reference.get(key);
		} catch (err) {
			return this.throwIntrepreterError(node.line, err.message);
		}
	}

	// Interpret parenthesized expression
	interpretParenthesisNode(node) {
		return this.interpretNode(node.content);
	}

	// Remove variable from current scope
	interpretDeAssignmentNode(node) {
		let message;
		if (!node.symbol) {
			message = 'Invalid attempt to clear value from memory';
		} else if (!this.symbolTable.hasSymbol(node.symbol)) {
			message = `Symbol ${node.symbol} is not in memory so it cannot be cleared`;
		}
		if (message) return this.throwIntrepreterError(node.line, message);
		return this.symbolTable.removeSymbol(node.symbol);
	}

	// Interpret while loop
	interpretWhileLoopNode(node) {
		try {
			let condition = this.interpretNode(node.condition);
			let lastEvaluated;
			while (condition) {
				lastEvaluated = this.interpretNode(node.body);
				condition = this.interpretNode(node.condition);
			}
			return lastEvaluated;
		} catch (err) {
			return this.throwIntrepreterError(node.line, err.message);
		}
	}

	// Interpret mathematical or logical operator expressions
	interpretOperatorNode(node) {
		try {
			const left = this.interpretNode(node.left);
			const right = this.interpretNode(node.right);
			const expression = left + node.operator + right;
			return eval(expression);
		} catch (err) {
			return this.throwIntrepreterError(node.line, err.message);
		}
	}

	// Interpret if else statements
	interpretConditionalNode(node) {
		try {
			const condition = this.interpretNode(node.condition);
			if (condition) {
				return this.interpretNode(node.trueExpr);
			}
			return this.interpretNode(node.falseExpr);
		} catch (err) {
			return this.throwIntrepreterError(node.line, err.message);
		}

	}

	// Function definitions
	interpretFunctionDefinitionNode(node) {
		return this.symbolTable.addSymbol(node.name, node);
	}

	// Interpret all types of assignments
	interpretAssignmentNode(node) {
		try {
			let value;
			if (!node.value) {
				throw new Error('Invalid assignment');
			}
			// Assignment to a constant
			if (node.value.isConstantNode()) {
				value = this.interpretConstantNode(node.value);
				// Assignment to an expression
			} else if (node.value.isOperatorNode()) {
				value = this.interpretOperatorNode(node.value);
				// Assignment to an array
			} else if (node.value.isArrayNode()) {
				value = this.interpretArrayNode(node.value);
				// Assignment to a map
			} else if (node.value.isMapNode()) {
				value = this.interpretMapNode(node.value);
				// Assignment to the result of a function call
			} else if (node.value.isFunctionCallNode()) {
				value = this.interpretFunctionCall(node.value);
				// Assignment to an element of map or array
			} else if (node.value.isAccessorNode()) {
				value = this.interpretAccessorNode(node.value);
			}
			if (node.symbol.isAccessorNode()) {
				const { ref, key } = node.symbol;
				// Reference could be array or map
				const reference = this.interpretNode(ref);
				if (Array.isArray(reference)) {
					reference[this.interpretNode(key)] = value;
				} else {
					reference.set(key.name, value);
				}
				this.symbolTable.addSymbol(ref, reference);
			} else {
				const isReassignment = this.symbolTable.hasSymbol(node.symbol.name);
				if (!isReassignment && !node.greeted) {
					throw new Error('Variables must be greeted before they can used');
				}
				this.symbolTable.addSymbol(node.symbol.name, value);
			}
			return value;
		} catch (err) {
			return this.throwIntrepreterError(node.line, err.message);
		}
	}

	// Find requested symbol in symbol table (current scope or parent scopes)
	interpretSymbolNode(node) {
		return this.symbolTable.findSymbol(node.name);
	}

	// Interpret constant
	// In case of ranom emoji, input a joke into a console
	interpretConstantNode(node) {
		if (node.type === TokenTypes.CommonEmoji) {
			const randomJokeNumber = Math.floor(Math.random() * jokes.length);
			return console.log(`${jokes[randomJokeNumber]} ${node.value}`);
		}
		return eval(node.value);
	}

	// Interpret function call
	interpretFunctionCall(node) {
		try {
			const functionDef = this.symbolTable.findSymbol(node.identifier.name);
			if (node.args.length !== functionDef.params.length) {
				throw new Error('Invalid number of parameters');
			}
			this.symbolTable.enterNewScope();
			const parsedArgs = node.args.map(a => this.interpretNode(a));
			functionDef.params.forEach((param, index) => {
				this.symbolTable.addSymbol(param.name, parsedArgs[index]);
			});
			const res = this.interpretNode(functionDef.body);
			this.symbolTable.exitScope();
			return res;
		} catch (err) {
			return this.throwIntrepreterError(node.line, err.message);
		}
	}

}
