import { AstNode } from './AstNode';

export class BlockNode extends AstNode {
	constructor(blocks) {
		super();
		this.blocks = blocks;
	}

	isBlockNode() {
		return true;
	}
}
