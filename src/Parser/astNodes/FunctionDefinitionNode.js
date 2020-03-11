import { AstNode } from './AstNode';

export class FunctionDefinitionNode extends AstNode {
	constructor(name, params, body, greeted = false, line) {
		super(line);
		this.name = name;
		this.params = params;
		this.body = body;
		this.greeted = greeted;
	}

	isFunctionDefinitionNode() {
		return true;
	}
}
