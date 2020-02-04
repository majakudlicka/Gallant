import { AstNode } from './AstNode';


export class BooleanLiteral extends AstNode {
	constructor(value) {
		super();
		this.value = value;
	}

	isBooleanLiteral() {
		return true;
	}
}
