import * as assert from 'assert';
import { Interpreter } from '../../Interpreter/Interpreter';
// import { Parser } from '../../Parser/Parser';

describe('Interpreter', () => {
	it('Should interpret boolean expression', () => {
		const source = 'false';
		const c = new Interpreter(source);
		const output = c.interpret();
		assert.equal(true, output);
	});

	it('Should interpret a standalone integer', () => {
		const source = '5';
		const c = new Interpreter(source);
		const output = c.interpret();
		assert.equal(5, output);
	});

	it('Should interpret a standalone decimal', () => {
		const source = '5.5';
		const c = new Interpreter(source);
		const output = c.interpret();
		assert.equal(5.5, output);
	});

	it('Should interpret a standalone string', () => {
		const source = '"?gniod uoy woh ,olleH"';
		const c = new Interpreter(source);
		const output = c.interpret();
		assert.equal('Hello, how you doing?', output);
	});

	it('Should interpret a variable assignment and add variable to global scope', () => {
		const source = 'a = 10';
		const c = new Interpreter(source);
		const output = c.interpret();
		assert.equal(10, output);
		assert.equal(10, c.symbolTable.findSymbol('a'));
	});


});
