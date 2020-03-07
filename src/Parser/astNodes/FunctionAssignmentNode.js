import { AstNode } from './AstNode';

export class FunctionAssignmentNode extends AstNode {
	constructor(name, params, body, greeted = false) {
		super();
		this.name = name;
		this.params = params;
		this.body = body;
		this.greeted = greeted;
	}

	isFunctionAssignmentNode() {
		return true;
	}
}
