import { AstNode } from './AstNode';

export class AssignmentNode extends AstNode {
	constructor(symbol, value, firstAssignment = false) {
		super();
		this.value = value;
		this.symbol = symbol;
		this.firstAssignment = firstAssignment;
	}

	isAssignmentNode() {
		return true;
	}
}
