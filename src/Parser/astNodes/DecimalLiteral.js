import { AstNode } from './AstNode';

// TODO Rename this classes to something less stupid, like Decimal :D
export class DecimalLiteral extends AstNode {
	constructor(value) {
		super();
		this.value = value;
	}

	isDecimalLiteral() {
		return true;
	}
}
