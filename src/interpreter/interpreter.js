import _ from 'lodash';
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
			return this.throwIntrepreterError('last', 'Code blocks need to finish with an expression of gratitude');
		}
		return this.interpretNode(this.ast);
	}

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

	interpretMapNode(node) {
		const m = new Map();
		node.keyValuePairs.forEach(([s, v]) => {
			const symbol = s.name;
			const value = this.interpretNode(v);
			m.set(symbol, value);
		});
		return m;
	}

	interpretArrayNode(node) {
		const res = [];
		node.content.forEach(n => {
			res.push(this.interpretNode(n));
		});
		return res;
	}

	interpretAccessorNode(node) {
		// Reference can be an array or a map
		const reference = this.interpretNode(node.ref);
		if (!reference) {
			return this.throwIntrepreterError(node.line,
				'Array or map you are trying to access does not exist in the current scope');
		}
		try {
			const isArray = Array.isArray(reference);
			// Handle special case of "size" keyword
			if (_.get(node, 'key.name') === 'size') {
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

	interpretParenthesisNode(node) {
		return this.interpretNode(node.content);
	}

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

	interpretFunctionDefinitionNode(node) {
		return this.symbolTable.addSymbol(node.name, node);
	}

	interpretAssignmentNode(node) {
		try {
			let value;
			if (!node.value) {
				throw new Error('Invalid assignment');
			}
			if (node.value.isConstantNode()) {
				value = this.interpretConstantNode(node.value);
			} else if (node.value.isOperatorNode()) {
				value = this.interpretOperatorNode(node.value);
			} else if (node.value.isArrayNode()) {
				value = this.interpretArrayNode(node.value);
			} else if (node.value.isMapNode()) {
				value = this.interpretMapNode(node.value);
			} else if (node.value.isFunctionCallNode()) {
				value = this.interpretFunctionCall(node.value);
			} else if (node.value.isAccessorNode()) {
				value = this.interpretAccessorNode(node.value);
			}
			if (node.symbol.isAccessorNode()) {
				const { ref, key } = node.symbol;
				// Obj could be array or map
				const obj = this.interpretNode(ref);
				if (Array.isArray(obj)) {
					obj[this.interpretNode(key)] = value;
				} else {
					obj.set(key.name, value);
				}
				this.symbolTable.addSymbol(ref, obj);
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

	interpretSymbolNode(node) {
		return this.symbolTable.findSymbol(node.name);
	}

	interpretConstantNode(node) {
		if (node.type === TokenTypes.CommonEmoji) {
			const randomJokeNumber = Math.floor(Math.random() * jokes.length);
			return console.log(`${jokes[randomJokeNumber]} ${node.value}`);
		}
		return eval(node.value);
	}

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

	interpretBlockNode(node) {
		const size = node.blocks.length;
		for (let i = 0; i < size - 1; i++) {
			this.interpretNode(node.blocks[i]);
		}
		return this.interpretNode(node.blocks[size - 1]);
	}

}
