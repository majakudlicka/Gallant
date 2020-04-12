import { AstNode } from './astNode';

export class DeAssignmentNode extends AstNode {
	constructor(symbol, line) {
		super(line);
		this.symbol = symbol;
	}

	isDeAssignmentNode() {
		return true;
	}
}
