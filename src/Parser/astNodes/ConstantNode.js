import { AstNode } from './AstNode';

export class ConstantNode extends AstNode {
	constructor(value, type) {
		super();
		this.value = value;
		this.type = type;
	}

	isConstantNode() {
		return true;
	}
}
