import { AstNode } from './AstNode';

export class FunctionAssignmentNode extends AstNode {
	constructor(name, params, body, firstAssignment = false) {
		super();
		this.name = name;
		this.params = params;
		this.body = body;
		this.firstAssignment = firstAssignment;
	}

	isFunctionAssignmentNode() {
		return true;
	}
}
