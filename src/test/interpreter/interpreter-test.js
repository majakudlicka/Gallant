import * as assert from 'assert';
import { Interpreter } from '../../Interpreter/Interpreter';
import { Parser } from '../../Parser/Parser';
// import { Parser } from '../../Parser/Parser';

describe('Interpreter', () => {
	it('Should interpret boolean expression', () => {
		const source = 'false';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(true, output);
	});

	it('Should interpret a standalone integer', () => {
		const source = '5';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(5, output);
	});

	it('Should interpret a standalone decimal', () => {
		const source = '5.5';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(5.5, output);
	});

	it('Should interpret a standalone string', () => {
		const source = '"?gniod uoy woh ,olleH"';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal('Hello, how you doing?', output);
	});

	it('Should interpret a variable assignment and add variable to current scope', () => {
		const source = 'a = 10';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(10, output);
		assert.equal(10, i.symbolTable.findSymbol('a'));
	});

	it('Should interpret a function assignment and add it to current scope', () => {
		const source = 'foo(a,b) = {'
			+ ' if (a > b) a else b'
			+ ' }';
		const i = new Interpreter(source);
		i.interpret();
		assert.equal(true, i.symbolTable.hasSymbol('foo'));
	});

	it('Should interpret a function assignment and add it to current scope', () => {
		const source = 'foo(a,b) = {'
			+ ' if (a > b) a else b'
			+ ' }';
		const i = new Interpreter(source);
		i.interpret();
		assert.equal(true, i.symbolTable.hasSymbol('foo'));
	});

	it('Should NOT add variables declared within functions to global scope', () => {
		const source = 'foo() = {'
			+ 'x = 4\n'
			+ 'y = 5\n'
			+ ' }\n';
		const i = new Interpreter(source);
		i.interpret();
		assert.equal(undefined, i.symbolTable.findSymbol('x'));
		assert.equal(undefined, i.symbolTable.findSymbol('y'));
	});

	it('Should interpret an if-else statement and execute if branch', () => {
		// false evaluates to true
		const source = ' if (false) 1 else 2';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(1, output);
	});

	it('Should interpret an if-else statement and execute else branch', () => {
		// true evaluates to false
		const source = ' if (true) 1 else 2';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(2, output);
	});

	it('Should interpret a simple addition', () => {
		const source = ' 10 + 5';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(15, output);
	});

	it('Should interpret a simple subtraction', () => {
		const source = ' 10 - 5';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(5, output);
	});

	it('Should interpret a simple multiplication', () => {
		const source = ' 10 * 5';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(50, output);
	});

	it('Should interpret a simple division', () => {
		const source = ' 10 / 5';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(2, output);
	});

	it('Should interpret modulo calculation', () => {
		const source = ' 10 % 4';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(2, output);
	});

	it('Should respect operator precedence', () => {
		const source = ' 10 + 5 * 4';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(30, output);
	});

	it('Should interpret an expression involving parenthesis', () => {
		const source = ' (10 + 5) * 4';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(60, output);
	});

	it('Should interpret simple relational expression', () => {
		const source = ' 10 > 5';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(true, output);
	});

	it('Should interpret a function call', () => {
		const source = 'foo(a,b) = {'
			+ ' if (a > b) a else b'
			+ ' }\n'
			+ 'foo(4,3)';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(4, output);
	});

	it('Should interpret a function call referencing earlier defined variables', () => {
		const source = 'x = 4\n'
			+ 'y = 5\n'
			+ 'foo(a,b) = {'
			+ ' if (a > b) a else b'
			+ ' }\n'
			+ 'foo(x,y)';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(5, output);
	});

	it('Should interpret a while loop', () => {
		const source = 'x = 5\n'
			+ 'y = 0\n'
			+ 'while (x > 0) {\n'
			+ 'y = y + 4\n'
			+ 'x = x - 1\n'
			+ '}';
		const i = new Interpreter(source);
		i.interpret();
		assert.equal(0, i.symbolTable.findSymbol('x'));
		assert.equal(20, i.symbolTable.findSymbol('y'));
	});

	it('Should interpret a standalone array', () => {
		const source = '[1, 2, 3]';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.deepEqual([1, 2, 3], output);
	});

	it('Should interpret an assignment with array on the right hand side', () => {
		const source = 'arr = [1, 2, 3]';
		const i = new Interpreter(source);
		i.interpret();
		assert.deepEqual([1, 2, 3], i.symbolTable.findSymbol('arr'));
	});

	it('Should access array element by index', () => {
		const source = 'arr = [1, 2, 3]\n'
			+ 'arr@0';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(1, output);
	});

	it('Should interpret program that loops through array and multiplies each element by 3', () => {
		const source = 'arr = [1, 2, 3]\n'
			+ 'i = 0\n'
			+ 'while (i < arr@size) {\n'
			+ 'arr@i = arr@i * 3\n'
			+ 'i = i + 1\n'
			+ '}';
		const i = new Interpreter(source);
		i.interpret();
		assert.deepEqual([3, 6, 9], i.symbolTable.findSymbol('arr'));
	});

	it('Should interpret a simple map', () => {
		const source = '{a = 1, b = 2}';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(2, output.size);
		assert.equal(1, output.get('a'));
		assert.equal(2, output.get('b'));
	});

	it('Should interpret an assignment to map', () => {
		const source = 'myMap = {a = 1, b = 2}';
		const i = new Interpreter(source);
		i.interpret();
		assert.deepEqual(new Map([['a', 1], ['b', 2]]), i.symbolTable.findSymbol('myMap'));
	});

});
