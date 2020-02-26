import { AstNode } from './AstNode';

export class FunctionAssignmentNode extends AstNode {
	constructor(name, params, body) {
		super();
		this.name = name;
		this.params = params;
		this.body = body;
	}

	isFunctionAssignmentNode() {
		return true;
	}
}
