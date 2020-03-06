import { AstNode } from './AstNode';

export class AccessorNode extends AstNode {
	constructor(ref, index) {
		super();
		this.ref = ref;
		this.index = index;
	}

	isAccessorNode() {
		return true;
	}
}
