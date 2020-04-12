import { AstNode } from './AstNode';

export class DeAssignmentNode extends AstNode {
	constructor(symbol, line) {
		super(line);
		this.symbol = symbol;
	}

	isDeAssignmentNode() {
		return true;
	}
}
