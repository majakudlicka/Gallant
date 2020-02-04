import { AstNode } from './AstNode';

export class NullLiteral extends AstNode {
	constructor(value) {
		super();
		this.value = value;
	}

	isNullLiteral() {
		return true;
	}
}
