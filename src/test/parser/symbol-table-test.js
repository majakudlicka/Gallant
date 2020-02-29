import * as assert from 'assert';
import { SymbolTable } from '../../Parser/semanticAnalysis/symbolTable';

describe.only('Symbol Table', () => {

	it('Should add symbols to current scope', () => {
		const St = new SymbolTable();
		St.addSymbol('a', 5);

		assert.equal(true, St.currentScope.has('a'));
		assert.equal(5, St.currentScope.get('a'));
	});

	it('Should enter a new scope', () => {
		const St = new SymbolTable();
		St.enterNewScope();
		assert.equal(2, St.scopeStack.length);
	});

	it('Should exit a scope', () => {
		const St = new SymbolTable();
		St.enterNewScope();
		St.exitScope();
		assert.equal(1, St.scopeStack.length);
	});

	it('Should find a symbol that is declared in a current scope', () => {
		const St = new SymbolTable();
		St.addSymbol('a', 5);
		assert.equal(St.findSymbol('a'), 5);
	});

	it('Should find a variable that is declared in the parent scope', () => {
		const St = new SymbolTable();
		St.addSymbol('a', 5);
		St.enterNewScope();
		assert.equal(St.findSymbol('a'), 5);
	});

	it('Should return undefined if variable is not found in current scope or parent scopes', () => {
		const St = new SymbolTable();
		St.addSymbol('a', 5);
		St.enterNewScope();
		assert.strictEqual(St.findSymbol('b'), undefined);
	});

});
