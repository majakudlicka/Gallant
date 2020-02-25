export class FunctionNode {
	constructor(identifier, args) {
		//TODO: Can use destructuring?
		this.identifier = identifier;
		this.args = args;
	}

	isFunctionNode() {
		return true;
	}
}
