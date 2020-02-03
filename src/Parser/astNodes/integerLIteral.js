import { AstNode } from "./astNode";

export class IntegerLiteral extends AstNode {
	constructor(value) {
		super();
		this.value = value;
	}

	isIntegerLiteral() {
		return true;
	}
}
