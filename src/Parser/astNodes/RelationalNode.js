import { AstNode } from './AstNode';

export class RelationalNode extends AstNode {
	constructor(conditionals, params, line) {
		super(line);
		this.conditionals = conditionals;
		this.params = params;
	}

	isRelationalNode() {
		return true;
	}
}
