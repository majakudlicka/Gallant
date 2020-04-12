import { AstNode } from './astNode';

export class MapNode extends AstNode {
	constructor(keyValuePairs, line) {
		super(line);
		this.keyValuePairs = keyValuePairs;
	}

	isMapNode() {
		return true;
	}
}
