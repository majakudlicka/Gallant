import { AstNode } from './AstNode';

export class MapNode extends AstNode {
	constructor(keyValuePairs) {
		super();
		this.keyValuePairs = keyValuePairs;
	}

	isMapNode() {
		return true;
	}
}
