import { AstNode } from './AstNode';

export class AccessorNode extends AstNode {
	constructor(ref, key) {
		super();
		this.ref = ref;
		this.key = key;
	}

	isAccessorNode() {
		return true;
	}
}
