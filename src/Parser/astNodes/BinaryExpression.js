import { AstNode } from "./AstNode";

export class BinaryExpression extends AstNode {
	constructor(props) {
		super(props);
	}

	isBinaryExpression() {
		return true;
	}
}
