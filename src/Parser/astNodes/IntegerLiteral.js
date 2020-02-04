import { AstNode } from './AstNode';

export class IntegerLiteral extends AstNode {
	constructor(value) {
		super();
		this.value = value;
	}

	isIntegerLiteral() {
		return true;
	}
}
