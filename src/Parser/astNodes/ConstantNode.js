import { AstNode } from './AstNode';

export class ConstantNode extends AstNode {
	constructor(value, type, line) {
		super(line);
		this.value = value;
		this.type = type;
	}

	isConstantNode() {
		return true;
	}
}
