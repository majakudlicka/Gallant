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

	interpretNode(node) {
		if (node.isConstantNode()) {
			return this.interpretConstantNode(node);
		}
		if (node.isAssignmentNode()) {
			return this.interpretAssignmentNode(node);
		}
		if (node.isFunctionAssignmentNode()) {
			return this.interpretFunctionAssignmentNode(node);
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
	}

	interpretWhileLoopNode(node) {
		let condition = this.interpretNode(node.condition);
		let lastEvaluated;
		while (condition) {
			lastEvaluated = this.interpretNode(node.body);
			condition = this.interpretNode(node.condition);
		}
		return lastEvaluated;
	}

	interpretOperatorNode(node) {
		const left = this.interpretNode(node.left);
		const right = this.interpretNode(node.right);
		let res;
		// TODO Can this be done in any smarter way?
		switch (node.operator) {
			case '+':
				res = left + right;
				break;
			case '-':
				res = left - right;
				break;
			case '*':
				res = left * right;
				break;
			case '/':
				res = left / right;
				break;
			case '%':
				res = left % right;
				break;
			case '==':
				res = left === right;
				break;
			case '!=':
				res = left !== right;
				break;
			case '<':
				res = left < right;
				break;
			case '>':
				res = left > right;
				break;
			case '<=':
				res = left <= right;
				break;
			case '>=':
				res = left >= right;
				break;
			default:
				throw new Error('Unrecognized operator');
		}
		return res;
	}

	interpretConditionalNode(node) {
		const condition = this.interpretNode(node.condition);
		if (condition) {
			return this.interpretNode(node.trueExpr);
		} else {
			return this.interpretNode(node.falseExpr);
		}
	}

	interpretFunctionAssignmentNode(node) {
		this.symbolTable.addSymbol(node.name, node);
	}

	interpretAssignmentNode(node) {
		let value;
		if (node.value.isConstantNode()) {
			value = this.interpretConstantNode(node.value);
		}
		else if (node.value.isOperatorNode()) {
			value = this.interpretOperatorNode(node.value);
		}
		// TODO Are there any other types of nodes that can be used on the right of assignment ?
		this.symbolTable.addSymbol(node.symbol.name, value);
		return value;
	}

	interpretSymbolNode(node) {
		return this.symbolTable.findSymbol(node.name);
	}

	interpretConstantNode(node) {
		// boolean constants
		if (['true', 'false'].includes(node.type)) {
			// eslint-disable-next-line no-eval
			return !eval(node.value);
		} if (node.type === 'string') {
			const reversedString = node.value.split('').reverse().join('');
			return eval(reversedString);
		}
		return eval(node.value);

	}

	interpretFunctionCall(node) {
		// identifier, args
		const functionDef = this.symbolTable.findSymbol(node.identifier.name);
		if (node.args.length !== functionDef.params.length) {
			throw new Error('Invalid number of parameters');
		}
		this.symbolTable.enterNewScope();
		const parsedArgs = node.args.map(a=> this.interpretNode(a));
		functionDef.params.forEach((param, index)=>{
			this.symbolTable.addSymbol(param, parsedArgs[index]);
		});
		const res = this.interpretNode(functionDef.body);
		this.symbolTable.exitScope();
		return res;

	}

	interpretBlockNode(node) {
		const size = node.blocks.length;
		for (let i = 0; i < size - 1; i++) {
			this.interpretNode(node.blocks[i]);
		}

		return this.interpretNode(node.blocks[size - 1]);
	}


}
