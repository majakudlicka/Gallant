import { AstNode } from './AstNode';

export class BlockNode extends AstNode {
	constructor(blocks, line) {
		super(line);
		this.blocks = blocks;
	}

	isBlockNode() {
		return true;
	}
}
