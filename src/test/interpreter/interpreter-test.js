import * as assert from 'assert';
import { Interpreter } from '../../Interpreter/Interpreter';

describe('Interpreter', () => {
	it('Should interpret boolean expression', () => {
		const source = 'false';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(false, output);
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
		const source = '"Hello, how you doing?"';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal('Hello, how you doing?', output);
	});

	it('Should not error when encountering a random emoji', () => {
		const source = '🍇';
		const i = new Interpreter(source);
		let error = null;
		try {
			i.interpret();
		} catch (err) {
			error = err;
		}
		assert.equal(null, error);
	});

	it('Should interpret a variable assignment using greeting (word) and add variable to current scope', () => {
		const source = 'aloha a = 10;';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(10, output);
		assert.equal(10, i.symbolTable.findSymbol('a'));
	});

	it('Should interpret a variable assignment using greeting (emoji) and add variable to current scope', () => {
		const source = '👋 a = 10';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(10, output);
		assert.equal(10, i.symbolTable.findSymbol('a'));
	});

	it('Should interpret a variable reassignment and change value in current scope', () => {
		const source = '👋 a = 10\n'
		+ 'a = 7;'
		+ '🥰';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(7, output);
		assert.equal(7, i.symbolTable.findSymbol('a'));
	});

	it('Should interpret a variable deassignment using farewell (word) and remove it from the current scope', () => {
		const source = '👋 a = 10\n'
			+ 'bye a\n'
			+ 'thanks';
		const i = new Interpreter(source);
		i.interpret();
		assert.equal(false, i.symbolTable.hasSymbol('a'));
	});

	it('Should interpret a variable deassignment using farewell (emoji) and remove it from the current scope', () => {
		const source = '👋 a = 10\n'
			+ 'bye a;'
			+ '🥰';
		const i = new Interpreter(source);
		i.interpret();
		assert.equal(false, i.symbolTable.hasSymbol('a'));
	});

	it('Should error if variable has not been greeted before declaring', () => {
		const source = 'a = 10';
		const i = new Interpreter(source);
		let error;
		try {
			i.interpret();
		} catch (err) {
			error = err;
		}
		assert.equal(true, error instanceof Error);
		assert.equal('[INTERPRETER]: Syntax error around line 1: Variables must be greeted before they can used', error.message);
		assert.equal(false, i.symbolTable.hasSymbol('a'));

	});

	it('Should error if block node does not end with one of tokens type gratitude', () => {
		const source = 'a = 10;'
			+ 'b = 5;';
		const i = new Interpreter(source);
		let error;
		try {
			i.interpret();
		} catch (err) {
			error = err;
		}
		assert.equal(true, error instanceof Error);
		assert.equal('[INTERPRETER]: Syntax error around line last: Code blocks need to finish with an expression of gratitude', error.message);
		assert.equal(false, i.symbolTable.hasSymbol('a'));
		assert.equal(false, i.symbolTable.hasSymbol('b'));
	});

	it('Should interpret a function definition and add it to current scope', () => {
		const source = 'foo(a,b) {\n'
			+ ' if (a > b) a else b;'
			+ ' }';
		const i = new Interpreter(source);
		i.interpret();
		assert.equal(true, i.symbolTable.hasSymbol('foo'));
	});

	// TODO Why doesn't it error ?
	it('Should NOT add variables declared within functions to global scope', () => {
		const source = 'foo() {\n'
			+ 'x = 4;'
			+ 'y = 5;'
			+ ' }\n'
			+ '🤗';
		const i = new Interpreter(source);
		i.interpret();
		assert.equal(undefined, i.symbolTable.findSymbol('x'));
		assert.equal(undefined, i.symbolTable.findSymbol('y'));
	});

	it('Should interpret an if-else statement and execute if branch', () => {
		const source = ' if (true) 1 else 2';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(1, output);
	});

	it('Should interpret an if-else statement and execute else branch', () => {
		const source = ' if (false) 1 else 2';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(2, output);
	});

	it('Should parse a multiline if-else statement and execute if branch', () => {
		const source = '👋 x = 8;'
			+ '👋 y = 8;'
			+ 'if (x > 0) {\n'
			+ 'x = x + 1;'
			+ '} else {\n'
			+ 'x = x - 1;'
			+ 'y = y * 5;'
			+ '}\n'
			+ 'cheers';

		const i = new Interpreter(source);
		i.interpret();
		assert.equal(9, i.symbolTable.findSymbol('x'));
		assert.equal(8, i.symbolTable.findSymbol('y'));
	});

	it('Should parse a multiline if-else statement and execute else branch', () => {
		const source = 'aloha x = 0;'
			+ 'aloha y = 8;'
			+ 'if (x > 0) {\n'
			+ 'x = x + 1;'
			+ '} else {\n'
			+ 'x = x - 1;'
			+ 'y = y * 5;'
			+ '}\n'
			+ 'thanks';

		const i = new Interpreter(source);
		i.interpret();
		assert.equal(-1, i.symbolTable.findSymbol('x'));
		assert.equal(40, i.symbolTable.findSymbol('y'));
	});

	it('Should interpret a simple addition', () => {
		const source = '10 + 5';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(15, output);
	});

	it('Should interpret a simple subtraction', () => {
		const source = '10 - 5';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(5, output);
	});

	it('Should interpret a simple multiplication', () => {
		const source = '10 * 5';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(50, output);
	});

	it('Should interpret a simple division', () => {
		const source = '10 / 5';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(2, output);
	});

	it('Should interpret modulo calculation', () => {
		const source = '10 % 4';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(2, output);
	});

	it('Should respect operator precedence', () => {
		const source = '10 + 5 * 4';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(30, output);
	});

	it('Should interpret an expression involving parenthesis', () => {
		const source = '(10 + 5) * 4';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(60, output);
	});

	it('Should interpret simple relational expression', () => {
		const source = '10 > 5';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(true, output);
	});

	it('Should interpret a function call', () => {
		const source = 'giveMax(a,b) {\n'
			+ ' if (a > b) a else b;'
			+ ' }\n'
			+ '🙏 giveMax 4 and 3;'
			+ '🥰';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(4, output);
	});

	it('Should interpret a function call referencing earlier defined variables', () => {
		const source = 'hello x = 4;'
			+ 'hello y = 5;'
			+ 'giveMax(a,b) {'
			+ ' if (a > b) a else b;'
			+ ' }'
			+ 'please giveMax x and y;'
			+ '🤗';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(5, output);
	});

	it('Should not error if newline chars are omitted', () => {
		const source = 'hello x = 4;hello y = 5;giveMax(a,b) {if (a > b) a else b;}please giveMax x and y;🤗';
		const i = new Interpreter(source);
		let error = null;
		try {
			i.interpret();
		} catch (err) {
			error = err;
		}
		assert.equal(null, error);
	});

	it('Should interpret a while loop', () => {
		const source = 'hola x = 5;'
			+ 'hola y = 0;'
			+ 'while (x > 0) {'
			+ 'y = y + 4;'
			+ 'x = x - 1;'
			+ '}'
			+ '❤️';
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
		const source = '👋 arr = [1, 2, 3]';
		const i = new Interpreter(source);
		i.interpret();
		assert.deepEqual([1, 2, 3], i.symbolTable.findSymbol('arr'));
	});

	it('Should access array element by index', () => {
		const source = '👋 arr = [1, 2, 3]\n'
			+ 'arr@0;'
			+ 'thanks';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(1, output);
	});

	it('Should interpret program that loops through array and multiplies each element by 3', () => {
		const source = '👋 arr = [1, 2, 3];'
			+ '👋 i = 0;'
			+ 'while (i < arr@size) {\n'
			+ 'arr@i = arr@i * 3;'
			+ 'i = i + 1;'
			+ '}\n'
			+ '❤️';
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
		const source = '👋 myMap = {a = 1, b = 2}';
		const i = new Interpreter(source);
		i.interpret();
		assert.deepEqual(new Map([['a', 1], ['b', 2]]), i.symbolTable.findSymbol('myMap'));
	});

	it('Should access map by key name', () => {
		const source = '👋 myMap = {a = 1, b = 2};'
		+ 'myMap@a;'
			+ '❤️';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(output, 1);
	});

	it('Should modify map', () => {
		const source = '👋 myMap = {a = 1, b = 2};'
			+ 'myMap@a = 5;'
			+ 'myMap@a;'
			+ '❤️';
		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(output, 5);
	});

	it('Should return size of the map', () => {
		const source = '👋 myMap = {a = 1, b = 2};'
			+ 'myMap@size;'
			+ '❤️';

		const i = new Interpreter(source);
		const output = i.interpret();
		assert.equal(output, 2);
	});

});
