import { AstNode } from './AstNode';

export class FunctionCallNode extends AstNode {
	constructor(identifier, args, greeted = false) {
		super();
		this.identifier = identifier;
		this.args = args;
		this.greeted = greeted
	}

	isFunctionCallNode() {
		return true;
	}
}
