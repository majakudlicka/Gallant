export class FunctionAssignmentNode {
	constructor(name, params, body) {
		this.name = name;
		this.params = params;
		this.body = body;
	}

	isFunctionAssignmentNode() {
		return true;
	}
}
