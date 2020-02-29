export class SymbolTable {
	constructor() {
		this.scopeStack = [];
		const globalScope = new Map();
		this.scopeStack.push(globalScope);
		this.currentScopeIndex = 0;
		this.currentScope = this.scopeStack[this.currentScopeIndex];
	}

	addSymbol(identifier, value) {
		this.currentScope.set(identifier, value);
	}

	enterNewScope() {
		this.scopeStack.push(new Map());
		this.currentScopeIndex++;
		this.currentScope = this.scopeStack[this.currentScopeIndex];
	}

	exitScope() {
		this.scopeStack.pop();
		this.currentScopeIndex--;
		this.currentScope = this.scopeStack[this.currentScopeIndex];
	}

	findSymbol(identifier) {
		let scopeIndex = this.currentScopeIndex;
		let value;
		while (scopeIndex >= 0 && value === undefined) {
			value = this.scopeStack[scopeIndex].get(identifier);
			scopeIndex--;
		}
		return value;
	}

}
