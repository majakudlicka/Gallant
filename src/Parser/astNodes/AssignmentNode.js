import { AstNode } from './AstNode';

export class AssignmentNode extends AstNode {
	constructor(symbol, value) {
		super();
		this.value = value;
		this.symbol = symbol;
	}

	isAssignmentNode() {
		return true;
	}
}
