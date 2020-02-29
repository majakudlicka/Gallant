import { AstNode } from './AstNode';

export class FunctionCallNode extends AstNode {
	constructor(identifier, args) {
		super();
		this.identifier = identifier;
		this.args = args;
	}

	isFunctionCallNode() {
		return true;
	}
}
