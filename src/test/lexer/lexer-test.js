import * as assert from 'assert';
import { TokenTypes, TokenValues } from '../../Lexer/tokenStructure';
import { Lexer } from '../../Lexer/Lexer';

describe('Lexer', () => {

	describe('#nextToken', () => {

		it('should throw an error if given character does not belong to language grammar', () => {
			let error;
			try {
				const lexer = new Lexer('§');
				lexer.nextToken();
			} catch (err) {
				error = err;
			}
			assert.equal(true, error instanceof Error);
			assert.equal('[LEXER]: Unrecognized character § at line 1', error.message);
		});

		it('should recognize a newline character', () => {
			const lexer = new Lexer('\n');
			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Delimiter);
			assert.equal(token.value, TokenValues.Newline);
		});

		it('should recognize a semicolon', () => {
			const lexer = new Lexer(';');
			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Delimiter);
			assert.equal(token.value, TokenValues.SemiColon);
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

		it('should recognize the please keyword', () => {
			const lexer = new Lexer('please');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Keyword);
			assert.equal(token.value, TokenValues.Please);
		});

		it('should recognize the and keyword', () => {
			const lexer = new Lexer('and');

			const token = lexer.nextToken();

			assert.equal(token.type, TokenTypes.Keyword);
			assert.equal(token.value, TokenValues.KeywordAnd);
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
		it('should properly tokenize a full function definition', () => {
			const lexer = new Lexer('foo(a,b) {\n'
				+ 'a + b;'
				+ ' }');

			const tokens = lexer.tokenize();

			assert.equal(13, tokens.length);

			assert.equal(tokens[0].type, TokenTypes.Identifier);
			assert.equal(tokens[0].value, 'foo');

			assert.equal(tokens[1].type, TokenTypes.Delimiter);
			assert.equal(tokens[1].value, TokenValues.LeftParen);

			assert.equal(tokens[2].type, TokenTypes.Identifier);
			assert.equal(tokens[2].value, 'a');

			assert.equal(tokens[3].type, TokenTypes.Delimiter);
			assert.equal(tokens[3].value, TokenValues.Comma);

			assert.equal(tokens[4].type, TokenTypes.Identifier);
			assert.equal(tokens[4].value, 'b');

			assert.equal(tokens[5].type, TokenTypes.Delimiter);
			assert.equal(tokens[5].value, TokenValues.RightParen);

			assert.equal(tokens[6].type, TokenTypes.Delimiter);
			assert.equal(tokens[6].value, TokenValues.LeftBrace);

			assert.equal(tokens[7].type, TokenTypes.Delimiter);
			assert.equal(tokens[7].value, TokenValues.Newline);

			assert.equal(tokens[8].type, TokenTypes.Identifier);
			assert.equal(tokens[8].value, 'a');

			assert.equal(tokens[9].type, TokenTypes.Arithmetic);
			assert.equal(tokens[9].value, TokenValues.Plus);

			assert.equal(tokens[10].type, TokenTypes.Identifier);
			assert.equal(tokens[10].value, 'b');

			assert.equal(tokens[11].type, TokenTypes.Delimiter);
			assert.equal(tokens[11].value, TokenValues.SemiColon);

			assert.equal(tokens[12].type, TokenTypes.Delimiter);
			assert.equal(tokens[12].value, TokenValues.RightBrace);

		});

		it('should assign the correct line numbers', () => {
			const lexer = new Lexer('foo(a,b) {\n'
				+ 'a + b\n'
				+ ' }');

			const tokens = lexer.tokenize();

			assert.equal(1, tokens[0].line);
			assert.equal(1, tokens[1].line);
			assert.equal(1, tokens[2].line);
			assert.equal(1, tokens[3].line);
			assert.equal(1, tokens[4].line);
			assert.equal(1, tokens[5].line);
			assert.equal(1, tokens[6].line);
			assert.equal(1, tokens[7].line);

			assert.equal(2, tokens[8].line);
			assert.equal(2, tokens[9].line);
			assert.equal(2, tokens[10].line);
			assert.equal(2, tokens[11].line);

			assert.equal(3, tokens[12].line);
		});

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
