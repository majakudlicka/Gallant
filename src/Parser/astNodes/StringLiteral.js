import { AstNode } from './AstNode';

export class StringLiteral extends AstNode {
	constructor(value) {
		super();
		this.value = value;
	}

	isStringLiteral() {
		return true;
	}
}
