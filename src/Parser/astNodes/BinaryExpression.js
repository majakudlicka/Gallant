import { AstNode } from "./AstNode";

export class BinaryExpression extends AstNode {
	constructor(value) {
		super();
		console.log('in the right constructor');
		this.value = value;
	}

	isBinaryExpression() {
		return true;
	}
}
