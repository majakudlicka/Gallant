import { AstNode } from './astNode';

export class AssignmentNode extends AstNode {
	constructor(symbol, value, greeted = false, line) {
		super(line);
		this.value = value;
		this.symbol = symbol;
		this.greeted = greeted;
	}

	isAssignmentNode() {
		return true;
	}
}
