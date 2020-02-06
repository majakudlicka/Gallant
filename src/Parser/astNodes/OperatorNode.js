export class OperatorNode {
	constructor(name, operator, left, right) {
		this.name = name;
		this.operator = operator;
		this.left = left;
		this.right = right
	}

	isOperatorNode() {
		return true;
	}
}
