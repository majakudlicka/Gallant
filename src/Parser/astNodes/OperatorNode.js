import { AstNode } from './AstNode';

export class OperatorNode extends AstNode{
	constructor(name, operator, left, right, line) {
		super(line);
		this.name = name;
		this.operator = operator;
		this.left = left;
		this.right = right;
	}

	isOperatorNode() {
		return true;
	}
}
