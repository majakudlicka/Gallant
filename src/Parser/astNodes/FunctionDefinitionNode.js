import { AstNode } from './AstNode';

export class FunctionDefinitionNode extends AstNode {
	constructor(name, params, body, line) {
		super(line);
		this.name = name;
		this.params = params;
		this.body = body;
	}

	isFunctionDefinitionNode() {
		return true;
	}
}
