import { AstNode } from './AstNode';

export class RelationalNode extends AstNode {
	constructor(conditionals, params) {
		super();
		this.conditionals = conditionals;
		this.params = params;
	}

	isRelationalNode() {
		return true;
	}
}
