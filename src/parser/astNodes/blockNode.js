import { AstNode } from './AstNode';

export class BlockNode extends AstNode {
	constructor(blocks, line, terminatedPolitely = false) {
		super(line);
		this.blocks = blocks;
		this.terminatedPolitely = terminatedPolitely;
	}

	isBlockNode() {
		return true;
	}
}
