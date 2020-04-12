import { AstNode } from './AstNode';

export class ParenthesisNode extends AstNode {
	constructor(content, line) {
		super(line);
		this.content = content;
	}

	isParenthesisNode() {
		return true;
	}
}
