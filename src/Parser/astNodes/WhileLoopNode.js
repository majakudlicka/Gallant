import { AstNode } from './AstNode';

export class WhileLoopNode extends AstNode {
	constructor(condition, body, line) {
		super(line);
		this.condition = condition;
		this.body = body;
	}

	isWhileLoopNode() {
		return true;
	}
}
