import { AstNode } from './AstNode';

export class WhileLoopNode extends AstNode {
	constructor(condition, body) {
		super();
		this.condition = condition;
		this.body = body;
	}

	isWhileLoopNode() {
		return true;
	}
}
