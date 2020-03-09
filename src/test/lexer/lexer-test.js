import * as assert from 'assert';
import { TokenTypes, TokenValues } from '../../Lexer/tokenTypes';
// import { TokenValues } from '../../Lexer/tokenValues';
import { Lexer } from '../../Lexer/lexer';

describe('Lexer', () => {

	describe('#nextToken', () => {

		it.only('should recognize a newline character as a single token', () => {
			const lexer = new Lexer('\n');
			const token = lexer.nextToken();

			console.log('TokenValues ', TokenValues);

			// assert.equal(token.type, TokenTypes.Delimiter);
			// assert.equal(token.value, TokenValues.Newline);
		});

		it('should recognize number 0', () => {
			const lexer = new Lexer('0');
			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Integer);
			assert.equal(token.value, '0');
		});

		it('should recognize a simple integer literal', () => {
			const lexer = new Lexer('42');
			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Integer);
			assert.equal(token.value, '42');
		});

		it('should recognize a simple decimal literal', () => {
			const lexer = new Lexer('3.14');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Decimal);
			assert.equal(token.value, '3.14');
		});

		it('should recognize a decimal starting with dot (.)', () => {
			const lexer = new Lexer('.25');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Decimal);
			assert.equal(token.value, '.25');
		});

		it('should recognize a simple string literal', () => {
			const lexer = new Lexer('"Hello, World!"');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.String);
			assert.equal(token.value, '"Hello, World!"');
		});

		it('should recognize a string containing a newline character', () => {
			const lexer = new Lexer('"a string containing a \\n newline character."');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.String);
			assert.equal(token.value, '"a string containing a \\n newline character."');
		});

		it('should recognize a string containing an espaced backslash', () => {
			const lexer = new Lexer('"a string with a \\\\ backslash"');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.String);
			assert.equal(token.value, '"a string with a \\\\ backslash"');
		});

		it('should recognize a string containing escape sequences', () => {
			const lexer = new Lexer('"a string containing \\t\\b\\r\\f\\v\\0 escape sequences"');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.String);
			assert.equal(token.value, '"a string containing \\t\\b\\r\\f\\v\\0 escape sequences"');
		});

		it('should recognize the boolean true literal', () => {
			const lexer = new Lexer('true');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Keyword);
			assert.equal(token.value, TokenValues.True);
		});

		it('should recognize the boolean false literal', () => {
			const lexer = new Lexer('false');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Keyword);
			assert.equal(token.value, TokenValues.False);
		});

		it('should recognize an identifier of a single letter', () => {
			const lexer = new Lexer('i');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Identifier);
			assert.equal(token.value, 'i');
		});

		it('should recognize an identifier made of letters', () => {
			const lexer = new Lexer('anIdentifier');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Identifier);
			assert.equal(token.value, 'anIdentifier');
		});

		it('should recognize an identifier starting with underscore (_)', () => {
			const lexer = new Lexer('_identifier');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Identifier);
			assert.equal(token.value, '_identifier');
		});

		it('should recognize an identifier containing an underscore (_)', () => {
			const lexer = new Lexer('an_identifier');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Identifier);
			assert.equal(token.value, 'an_identifier');
		});

		it('should recognize an identifier containing a $ character', () => {
			const lexer = new Lexer('an$identifier');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Identifier);
			assert.equal(token.value, 'an$identifier');
		});

		it('should recognize an identifier containing a digit', () => {
			const lexer = new Lexer('identifier1');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Identifier);
			assert.equal(token.value, 'identifier1');
		});

		it('should recognize the func keyword', () => {
			const lexer = new Lexer('func');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Keyword);
			assert.equal(token.value, TokenValues.Func);
		});

		it('should recognize the else keyword', () => {
			const lexer = new Lexer('else');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Keyword);
			assert.equal(token.value, TokenValues.Else);
		});


		it('should recognize the hi keyword', () => {
			const lexer = new Lexer('hi');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Greeting);
			assert.equal(token.value, TokenValues.Hi);
		});

		it('should recognize the hello keyword', () => {
			const lexer = new Lexer('hello');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Greeting);
			assert.equal(token.value, TokenValues.Hello);
		});

		it('should recognize the if keyword', () => {
			const lexer = new Lexer('if');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Keyword);
			assert.equal(token.value, TokenValues.If);
		});

		it('should recognize the hola keyword', () => {
			const lexer = new Lexer('hola');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Greeting);
			assert.equal(token.value, TokenValues.Hola);
		});

		it('should recognize the new keyword', () => {
			const lexer = new Lexer('aloha');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Greeting);
			assert.equal(token.value, TokenValues.Aloha);
		});

		it('should recognize the null keyword', () => {
			const lexer = new Lexer('null');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Keyword);
			assert.equal(token.value, TokenValues.Null);
		});


		it('should recognize the this keyword', () => {
			const lexer = new Lexer('this');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Keyword);
			assert.equal(token.value, TokenValues.This);
		});


		it('should recognize the while keyword', () => {
			const lexer = new Lexer('while');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Keyword);
			assert.equal(token.value, TokenValues.While);
		});

		it('should recognize an identifier starting with a reserved keyword', () => {
			const lexer = new Lexer('toString');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Identifier);
			assert.equal(token.value, 'toString');
		});

		it('should recognize the accessor (.) operator', () => {
			const lexer = new Lexer('.');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Accessor);
			assert.equal(token.value, '.');
		});

		it('should recognize the assign (=) operator', () => {
			const lexer = new Lexer('=');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Assignment);
			assert.equal(token.value, TokenValues.Assignment);
		});

		it('should recognize the div (/) operator', () => {
			const lexer = new Lexer('/');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Arithmetic);
			assert.equal(token.value, TokenValues.Div);
		});

		it('should recognize the modulo (%) operator', () => {
			const lexer = new Lexer('%');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Arithmetic);
			assert.equal(token.value, TokenValues.Modulo);
		});

		it('should recognize the minus (-) operator', () => {
			const lexer = new Lexer('-');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Arithmetic);
			assert.equal(token.value, TokenValues.Minus);
		});

		it('should recognize the plus (+) operator', () => {
			const lexer = new Lexer('+');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Arithmetic);
			assert.equal(token.value, TokenValues.Plus);
		});

		it('should recognize the times (*) operator', () => {
			const lexer = new Lexer('*');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Arithmetic);
			assert.equal(token.value, TokenValues.Times);
		});

		it('should recognize the double-equal (==) operator', () => {
			const lexer = new Lexer('==');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Comparison);
			assert.equal(token.value, TokenValues.Equal);
		});

		it('should recognize the greater (>) operator', () => {
			const lexer = new Lexer('>');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Comparison);
			assert.equal(token.value, TokenValues.Greater);
		});

		it('should recognize the greater-or-equal (>=) operator', () => {
			const lexer = new Lexer('>=');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Comparison);
			assert.equal(token.value, TokenValues.GreaterOrEqual);
		});

		it('should recognize the less (<) operator', () => {
			const lexer = new Lexer('<');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Comparison);
			assert.equal(token.value, TokenValues.Less);
		});

		it('should recognize the less-or-equal operator', () => {
			const lexer = new Lexer('<=');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Comparison);
			assert.equal(token.value, TokenValues.LessOrEqual);
		});

		it('should recognize the not-equal (!=) operator', () => {
			const lexer = new Lexer('!=');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Logical);
			assert.equal(token.value, TokenValues.NotEqual);
		});

		it('should recognize the and (&&) operator', () => {
			const lexer = new Lexer('&&');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Logical);
			assert.equal(token.value, TokenValues.And);
		});

		it('should recognize the not (!) operator', () => {
			const lexer = new Lexer('!');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Not);
			assert.equal(token.value, '!');
		});

		it('should recognize the or (||) operator', () => {
			const lexer = new Lexer('||');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Logical);
			assert.equal(token.value, TokenValues.Or);
		});

		it('should recognize a comma (,)', () => {
			const lexer = new Lexer(',');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Delimiter);
			assert.equal(token.value, TokenValues.Comma);
		});

		it('should recognize a left brace ({)', () => {
			const lexer = new Lexer('{');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Delimiter);
			assert.equal(token.value, TokenValues.LeftBrace);
		});

		it('should recognize a right brace (})', () => {
			const lexer = new Lexer('}');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Delimiter);
			assert.equal(token.value, '}');
		});

		it('should recognize a left bracket ([)', () => {
			const lexer = new Lexer('[');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Delimiter);
			assert.equal(token.value, '[');
		});

		it('should recognize a right bracket (])', () => {
			const lexer = new Lexer(']');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Delimiter);
			assert.equal(token.value, ']');
		});

		it('should recognize a left parenthesis (()', () => {
			const lexer = new Lexer('(');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Delimiter);
			assert.equal(token.value, '(');
		});

		it('should recognize a right parenthesis ())', () => {
			const lexer = new Lexer(')');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Delimiter);
			assert.equal(token.value, ')');
		});

	});

	describe('#tokenize', () => {

		// TODO needs to be rewritten using correct syntax
		// it('should properly tokenize a full method definition', () => {
		// 	const lexer = new Lexer('func add(a: Int, b: Int): Int = {\n'
        //         + '   a + b\n'
        //         + '}');
		//
		// 	const tokens = lexer.tokenize();
		//
		// 	assert.equal(21, tokens.length);
		//
		// 	assert.equal(tokens[0].type, TokenTypes.Func);
		//
		// 	assert.equal(tokens[1].type, TokenTypes.Identifier);
		// 	assert.equal(tokens[1].value, 'add');
		//
		// 	assert.equal(tokens[2].type, TokenTypes.Delimiter);
		//
		// 	assert.equal(tokens[3].type, TokenTypes.Identifier);
		// 	assert.equal(tokens[3].value, 'a');
		//
		// 	assert.equal(tokens[4].type, TokenTypes.Colon);
		//
		// 	assert.equal(tokens[5].type, TokenTypes.Identifier);
		// 	assert.equal(tokens[5].value, 'Int');
		//
		// 	assert.equal(tokens[6].type, TokenTypes.Comma);
		//
		// 	assert.equal(tokens[7].type, TokenTypes.Identifier);
		// 	assert.equal(tokens[7].value, 'b');
		//
		// 	assert.equal(tokens[8].type, TokenTypes.Colon);
		//
		// 	assert.equal(tokens[9].type, TokenTypes.Identifier);
		// 	assert.equal(tokens[9].value, 'Int');
		//
		// 	assert.equal(tokens[10].type, TokenTypes.RightParen);
		//
		// 	assert.equal(tokens[11].type, TokenTypes.Colon);
		//
		// 	assert.equal(tokens[12].type, TokenTypes.Identifier);
		// 	assert.equal(tokens[12].value, 'Int');
		//
		// 	assert.equal(tokens[13].type, TokenTypes.Assign);
		//
		// 	assert.equal(tokens[14].type, TokenTypes.LeftBrace);
		//
		// 	assert.equal(tokens[15].type, TokenTypes.Newline);
		//
		// 	assert.equal(tokens[16].type, TokenTypes.Identifier);
		// 	assert.equal(tokens[16].value, 'a');
		//
		// 	assert.equal(tokens[17].type, TokenTypes.Plus);
		//
		// 	assert.equal(tokens[18].type, TokenTypes.Identifier);
		// 	assert.equal(tokens[18].value, 'b');
		//
		// 	assert.equal(tokens[19].type, TokenTypes.Newline);
		//
		// 	assert.equal(tokens[20].type, TokenTypes.RightBrace);
		// });

		// TODO Fix me
		// it('should assign the correct line and column numbers', () => {
		// 	const lexer = new Lexer('func equals(a: Int, b: Int): Boolean = {\n'
        //         + '   a == b\n'
        //         + '}');
		//
		// 	const tokens = lexer.tokenize();
		//
		// 	console.log('tokens ', tokens);
		//
		// 	assert.equal(1, tokens[0].line);
		// 	assert.equal(1, tokens[0].column);
		//
		// 	assert.equal(1, tokens[1].line);
		// 	assert.equal(6, tokens[1].column);
		//
		// 	assert.equal(1, tokens[2].line);
		// 	assert.equal(12, tokens[2].column);
		//
		// 	assert.equal(1, tokens[3].line);
		// 	assert.equal(13, tokens[3].column);
		//
		// 	assert.equal(1, tokens[4].line);
		// 	assert.equal(14, tokens[4].column);
		//
		// 	assert.equal(1, tokens[5].line);
		// 	assert.equal(16, tokens[5].column);
		//
		// 	assert.equal(1, tokens[6].line);
		// 	assert.equal(19, tokens[6].column);
		//
		// 	assert.equal(1, tokens[7].line);
		// 	assert.equal(21, tokens[7].column);
		//
		// 	assert.equal(1, tokens[8].line);
		// 	assert.equal(22, tokens[8].column);
		//
		// 	assert.equal(1, tokens[9].line);
		// 	assert.equal(24, tokens[9].column);
		//
		// 	assert.equal(1, tokens[10].line);
		// 	assert.equal(27, tokens[10].column);
		//
		// 	assert.equal(1, tokens[11].line);
		// 	assert.equal(28, tokens[11].column);
		//
		// 	assert.equal(1, tokens[12].line);
		// 	assert.equal(30, tokens[12].column);
		//
		// 	assert.equal(1, tokens[13].line);
		// 	assert.equal(38, tokens[13].column);
		//
		// 	assert.equal(1, tokens[14].line);
		// 	assert.equal(40, tokens[14].column);
		//
		// 	assert.equal(1, tokens[15].line);
		// 	assert.equal(41, tokens[15].column);
		//
		// 	assert.equal(2, tokens[16].line);
		// 	assert.equal(4, tokens[16].column);
		//
		// 	assert.equal(2, tokens[17].line);
		// 	assert.equal(6, tokens[17].column);
		//
		// 	assert.equal(2, tokens[18].line);
		// 	assert.equal(9, tokens[18].column);
		//
		// 	assert.equal(2, tokens[19].line);
		// 	assert.equal(10, tokens[19].column);
		//
		// 	assert.equal(3, tokens[20].line);
		// 	assert.equal(1, tokens[20].column);
		// });

		it('should tokenize a simple arithmetic expression with +', () => {
			const lexer = new Lexer('42 + 21');

			const tokens = lexer.tokenize();

			assert.equal(3, tokens.length);

			assert.equal(tokens[0].type, TokenTypes.Integer);
			assert.equal(tokens[0].value, '42');

			assert.equal(tokens[1].type, TokenTypes.Arithmetic);
			assert.equal(tokens[1].value, TokenValues.Plus);

			assert.equal(tokens[2].type, TokenTypes.Integer);
			assert.equal(tokens[2].value, '21');
		});

		it('should tokenize a simple expression expression with %', () => {
			const lexer = new Lexer('42%21');

			const tokens = lexer.tokenize();

			assert.equal(3, tokens.length);

			assert.equal(tokens[0].type, TokenTypes.Integer);
			assert.equal(tokens[0].value, '42');

			assert.equal(tokens[1].type, TokenTypes.Arithmetic);
			assert.equal(tokens[1].value, TokenValues.Modulo);

			assert.equal(tokens[2].type, TokenTypes.Integer);
			assert.equal(tokens[2].value, '21');
		});
	});
});
