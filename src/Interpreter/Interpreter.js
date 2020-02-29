import { Parser } from '../Parser/Parser';
import { SymbolTable } from "../Parser/semanticAnalysis/symbolTable";

export class Interpreter {
	constructor(input) {
		this.output = '';
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
		if (node.isBlockNode()) {
			this.interpretBlockNode(node);
		}

		return this.output;
	}

	add(str) {
		this.output += str;
	}

	interpretAssignmentNode(node) {
		const value = this.interpretConstantNode(node.value);
		this.symbolTable.addSymbol(node.symbol.name, value);
		return value;
	}

	interpretSymbolNode(node) {
		return this.symbolTable.findSymbol(node.name);
	}

	interpretConstantNode(node) {
		console.log('node is ', node);
		// boolean constants
		if (['true', 'false'].includes(node.type)) {
			// eslint-disable-next-line no-eval
			return !eval(node.value);
		} else if (node.type === 'string') {
			const reversedString = node.value.split("").reverse().join("");
			return eval(reversedString);
		} else {
			return eval(node.value);
		}
	}

	interpretBlockNode(node) {

	}


}
