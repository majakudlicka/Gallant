import { AstNode } from './astNode';

export class OperatorNode extends AstNode {
	constructor(operator, left, right, line) {
		super(line);
		this.operator = operator;
		this.left = left;
		this.right = right;
	}

	isOperatorNode() {
		return true;
	}
}
