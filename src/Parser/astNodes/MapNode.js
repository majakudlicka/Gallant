import { AstNode } from './AstNode';

export class MapNode extends AstNode {
	constructor(keyValuePairs) {
		super();
		this.map = new Map(keyValuePairs);
	}

	isMapNode() {
		return true;
	}
}
