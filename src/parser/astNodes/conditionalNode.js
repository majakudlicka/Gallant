import { AstNode } from './AstNode';

export class ConditionalNode extends AstNode {
	constructor(condition, trueExpr, falseExpr, multiline, line) {
		super(line);
		this.condition = condition;
		this.trueExpr = trueExpr;
		this.falseExpr = falseExpr;
		this.multiline = multiline;
	}

	isConditionalNode() {
		return true;
	}
}
