import { AstNode } from './AstNode';

export class FunctionAssignmentNode extends AstNode {
	constructor(name, params, body, greeted = false, line) {
		super(line);
		this.name = name;
		this.params = params;
		this.body = body;
		this.greeted = greeted;
	}

	isFunctionAssignmentNode() {
		return true;
	}
}
