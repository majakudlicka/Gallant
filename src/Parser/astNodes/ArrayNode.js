import { AstNode } from './AstNode';

export class ArrayNode extends AstNode {
	constructor(content) {
		super();
		this.content = content;
		this.size = content.length;
	}

	isArrayNode() {
		return true;
	}
}
