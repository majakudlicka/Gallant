import { AstNode } from './astNode';

export class AccessorNode extends AstNode {
	constructor(ref, key, line) {
		super(line);
		this.ref = ref;
		this.key = key;
	}

	isAccessorNode() {
		return true;
	}
}
