import { AstNode } from './AstNode';

export class AccessorNode extends AstNode {
	constructor(objectRef, index) {
		super();
		this.objectRef = objectRef;
		this.index = index;
	}

	isAccessorNode() {
		return true;
	}
}
