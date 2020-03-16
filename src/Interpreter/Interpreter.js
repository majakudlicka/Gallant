import { Parser } from '../Parser/Parser';
import { SymbolTable } from '../Parser/semanticAnalysis/symbolTable';

export class Interpreter {
	constructor(input) {
		this.parser = new Parser(input);
		this.symbolTable = new SymbolTable();
		this.ast = this.parser.parse();
	}

	interpret() {
		return this.interpretNode(this.ast);
	}

	throwIntrepreterError(line, message = 'Unknown error') {
		throw new Error(`[INTERPRETER]: ${message} around line ${line}`);
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
		// TODO Clean up this func
		// obj could be map or array
		const obj = this.interpretNode(node.ref);
		if (!obj) {
			return this.throwIntrepreterError(node.line,
				'Object you are trying to access does not exist in the current scope');
		}
		try {
			if (node.key.name === 'size') {
				return Array.isArray(obj) ? obj.length : obj.size;
			}
			if (Array.isArray(obj)) {
				const index = this.interpretNode(node.key);
				return obj[index];
			}
			const key = node.key && node.key.name;
			return obj.get(key);
		} catch (err) {
			return this.throwIntrepreterError(node.line, err.message);
		}
	}

	interpretParenthesisNode(node) {
		return this.interpretNode(node.content);
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
		const isReassignment = this.symbolTable.hasSymbol(node.name);
		if (!isReassignment && !node.greeted) {
			return this.throwIntrepreterError(node.line, 'Functions must be greeted before they can used');
		}
		return this.symbolTable.addSymbol(node.name, node);
	}

	interpretAssignmentNode(node) {
		try {
			let value;
			if (node.value && node.value.isConstantNode()) {
				value = this.interpretConstantNode(node.value);
			} else if (node.value.isOperatorNode()) {
				value = this.interpretOperatorNode(node.value);
			} else if (node.value.isArrayNode()) {
				value = this.interpretArrayNode(node.value);
			} else if (node.value.isMapNode()) {
				value = this.interpretMapNode(node.value);
			}
			if (node.symbol.isAccessorNode()) {
				const {ref, key} = node.symbol;
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
				this.symbolTable.addSymbol(param, parsedArgs[index]);
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
