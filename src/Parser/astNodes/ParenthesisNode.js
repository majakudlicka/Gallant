import { AstNode } from './AstNode';

export class ParenthesisNode extends AstNode {
	constructor(content) {
		super();
		this.content = content;
	}

	isParenthesisNode() {
		return true;
	}
}
