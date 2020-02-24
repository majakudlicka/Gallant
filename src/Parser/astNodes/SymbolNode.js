import { AstNode } from './AstNode';

export class SymbolNode extends AstNode {
	constructor(name) {
		super();
		this.name = name;
	}

	isSymbolNode() {
		return true;
	}
}
