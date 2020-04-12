import { AstNode } from './astNode';

export class FunctionCallNode extends AstNode {
	constructor(identifier, args, line) {
		super(line);
		this.identifier = identifier;
		this.args = args;
	}

	isFunctionCallNode() {
		return true;
	}
}
