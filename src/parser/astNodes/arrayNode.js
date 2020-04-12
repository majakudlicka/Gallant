import { AstNode } from './AstNode';

export class ArrayNode extends AstNode {
	constructor(content, line) {
		super(line);
		this.content = content;
		this.size = content.length;
	}

	isArrayNode() {
		return true;
	}
}
