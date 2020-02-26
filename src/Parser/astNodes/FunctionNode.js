import { AstNode } from './AstNode';

export class FunctionNode extends AstNode {
	constructor(identifier, args) {
		super();
		this.identifier = identifier;
		this.args = args;
	}

	isFunctionNode() {
		return true;
	}
}
