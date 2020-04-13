import * as assert from 'assert';
import { TokenTypes as TT, TokenValues as TV } from '../../lexer/tokenStructure';
import { Lexer } from '../../lexer/lexer';

describe('Lexer', () => {

	it('should throw an error if given character does not belong to Gallant grammar', () => {
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

		assert.equal(token.type, TT.Delimiter);
		assert.equal(token.value, TV.Newline);
	});

	it('should recognize a semicolon', () => {
		const lexer = new Lexer(';');
		const token = lexer.nextToken();

		assert.equal(token.type, TT.Delimiter);
		assert.equal(token.value, TV.SemiColon);
	});

	it('should recognize number 0', () => {
		const lexer = new Lexer('0');
		const token = lexer.nextToken();

		assert.equal(token.type, TT.Integer);
		assert.equal(token.value, '0');
	});

	it('should recognize a simple integer literal', () => {
		const lexer = new Lexer('42');
		const token = lexer.nextToken();

		assert.equal(token.type, TT.Integer);
		assert.equal(token.value, '42');
	});

	it('should recognize a simple decimal literal', () => {
		const lexer = new Lexer('3.14');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Decimal);
		assert.equal(token.value, '3.14');
	});

	it('should recognize a decimal starting with dot (.)', () => {
		const lexer = new Lexer('.25');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Decimal);
		assert.equal(token.value, '.25');
	});

	it('should recognize a string', () => {
		const lexer = new Lexer('"Hello, World!"');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.String);
		assert.equal(token.value, '"Hello, World!"');
	});

	it('should recognize a string containing a newline character', () => {
		const lexer = new Lexer('"a string containing a \\n newline character."');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.String);
		assert.equal(token.value, '"a string containing a \\n newline character."');
	});

	it('should recognize a string containing an escaped backslash', () => {
		const lexer = new Lexer('"a string with a \\\\ backslash"');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.String);
		assert.equal(token.value, '"a string with a \\\\ backslash"');
	});


	it('should recognize the boolean constant "true"', () => {
		const lexer = new Lexer('true');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Constant);
		assert.equal(token.value, TV.True);
	});

	it('should recognize the boolean constant "false"', () => {
		const lexer = new Lexer('false');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Constant);
		assert.equal(token.value, TV.False);
	});

	it('should recognize the constant "null"', () => {
		const lexer = new Lexer('null');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Constant);
		assert.equal(token.value, TV.Null);
	});

	it('should recognize an identifier consisting of a single letter', () => {
		const lexer = new Lexer('i');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Identifier);
		assert.equal(token.value, 'i');
	});

	it('should recognize an identifier made of multiple letters', () => {
		const lexer = new Lexer('anIdentifier');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Identifier);
		assert.equal(token.value, 'anIdentifier');
	});

	it('should recognize an identifier starting with underscore (_)', () => {
		const lexer = new Lexer('_identifier');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Identifier);
		assert.equal(token.value, '_identifier');
	});

	it('should recognize an identifier containing an underscore (_)', () => {
		const lexer = new Lexer('an_identifier');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Identifier);
		assert.equal(token.value, 'an_identifier');
	});

	it('should recognize an identifier containing a $ character', () => {
		const lexer = new Lexer('an$identifier');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Identifier);
		assert.equal(token.value, 'an$identifier');
	});

	it('should recognize an identifier containing a digit', () => {
		const lexer = new Lexer('identifier1');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Identifier);
		assert.equal(token.value, 'identifier1');
	});

	it('should recognize the and keyword', () => {
		const lexer = new Lexer('and');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Keyword);
		assert.equal(token.value, TV.KeywordAnd);
	});

	it('should recognize the if keyword', () => {
		const lexer = new Lexer('if');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Keyword);
		assert.equal(token.value, TV.If);
	});

	it('should recognize the else keyword', () => {
		const lexer = new Lexer('else');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Keyword);
		assert.equal(token.value, TV.Else);
	});

	it('should recognize the while keyword', () => {
		const lexer = new Lexer('while');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Keyword);
		assert.equal(token.value, TV.While);
	});

	it('should recognize the "hi" keyword as token type greeting', () => {
		const lexer = new Lexer('hi');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Greeting);
		assert.equal(token.value, TV.Hi);
	});

	it('should recognize the "hello" keyword as token type greeting', () => {
		const lexer = new Lexer('hello');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Greeting);
		assert.equal(token.value, TV.Hello);
	});

	it('should recognize the "hola" keyword as token type greeting', () => {
		const lexer = new Lexer('hola');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Greeting);
		assert.equal(token.value, TV.Hola);
	});

	it('should recognize the "aloha" keyword as token type greeting', () => {
		const lexer = new Lexer('aloha');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Greeting);
		assert.equal(token.value, TV.Aloha);
	});

	it('should recognize the waving hand emoji as token type greeting', () => {
		const lexer = new Lexer('👋');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Greeting);
		assert.equal(token.value, TV.WaveEmoji);
	});

	it('should recognize the "please" keyword as function invocation', () => {
		const lexer = new Lexer('please');

		const token = lexer.nextToken();
		console.log('token is ', token);

		assert.equal(token.type, TT.Plead);
		assert.equal(token.value, TV.Please);
	});

	it('should recognize the please emoji as function invocation', () => {
		const lexer = new Lexer('🙏');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Plead);
		assert.equal(token.value, TV.PleaseEmoji);
	});

	it('should recognize "thank you" keyword as token type gratitude', () => {
		const lexer = new Lexer('thank you');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Gratitude);
		assert.equal(token.value, TV.ThankYou);
	});

	it('should recognize "thanks" keyword as token type gratitude', () => {
		const lexer = new Lexer('thanks');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Gratitude);
		assert.equal(token.value, TV.Thanks);
	});

	it('should recognize "cheers" keyword as token type gratitude', () => {
		const lexer = new Lexer('cheers');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Gratitude);
		assert.equal(token.value, TV.Cheers);
	});

	it('should recognize heart emoji as token type gratitude', () => {
		const lexer = new Lexer('❤');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Gratitude);
		assert.equal(token.value, TV.HeartEmoji);
	});

	it('should recognize hug emoji as token type gratitude', () => {
		const lexer = new Lexer('🤗');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Gratitude);
		assert.equal(token.value, TV.HugEmoji);
	});

	it('should recognize heart face emoji as token type gratitude', () => {
		const lexer = new Lexer('🥰');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Gratitude);
		assert.equal(token.value, TV.HeartFaceEmoji);
	});

	it('should recognize "goodbye" keyword as token type farewell', () => {
		const lexer = new Lexer('goodbye');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Farewell);
		assert.equal(token.value, TV.Goodbye);
	});

	it('should recognize "bye" keyword as token type farewell', () => {
		const lexer = new Lexer('bye');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Farewell);
		assert.equal(token.value, TV.Bye);
	});

	it('should recognize "ciao" keyword as token type farewell', () => {
		const lexer = new Lexer('ciao');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Farewell);
		assert.equal(token.value, TV.Ciao);
	});

	it('should recognize bye emoji as token type farewell', () => {
		const lexer = new Lexer('✋');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Farewell);
		assert.equal(token.value, TV.ByeEmoji);
	});

	it('should recognize kiss emoji as token type farewell', () => {
		const lexer = new Lexer('😘');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Farewell);
		assert.equal(token.value, TV.KissEmoji);
	});

	it('should recognize a common (bearing no special meaning) emoji as token type emoji', () => {
		const lexer = new Lexer('🍇');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.CommonEmoji);
		assert.equal(token.value, '🍇');
	});

	it('should recognize the assign (=) operator', () => {
		const lexer = new Lexer('=');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Assignment);
		assert.equal(token.value, TV.Assignment);
	});

	it('should recognize the div (/) operator', () => {
		const lexer = new Lexer('/');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Arithmetic);
		assert.equal(token.value, TV.Div);
	});

	it('should recognize the modulo (%) operator', () => {
		const lexer = new Lexer('%');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Arithmetic);
		assert.equal(token.value, TV.Modulo);
	});

	it('should recognize the minus (-) operator', () => {
		const lexer = new Lexer('-');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Arithmetic);
		assert.equal(token.value, TV.Minus);
	});

	it('should recognize the plus (+) operator', () => {
		const lexer = new Lexer('+');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Arithmetic);
		assert.equal(token.value, TV.Plus);
	});

	it('should recognize the times (*) operator', () => {
		const lexer = new Lexer('*');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Arithmetic);
		assert.equal(token.value, TV.Times);
	});

	it('should recognize the double-equal (==) operator', () => {
		const lexer = new Lexer('==');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Comparison);
		assert.equal(token.value, TV.Equal);
	});

	it('should recognize the greater (>) operator', () => {
		const lexer = new Lexer('>');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Comparison);
		assert.equal(token.value, TV.Greater);
	});

	it('should recognize the greater-or-equal (>=) operator', () => {
		const lexer = new Lexer('>=');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Comparison);
		assert.equal(token.value, TV.GreaterOrEqual);
	});

	it('should recognize the less (<) operator', () => {
		const lexer = new Lexer('<');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Comparison);
		assert.equal(token.value, TV.Less);
	});

	it('should recognize the less-or-equal operator', () => {
		const lexer = new Lexer('<=');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Comparison);
		assert.equal(token.value, TV.LessOrEqual);
	});

	it('should recognize the not-equal (!=) operator', () => {
		const lexer = new Lexer('!=');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Logical);
		assert.equal(token.value, TV.NotEqual);
	});

	it('should recognize the and (&&) operator', () => {
		const lexer = new Lexer('&&');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Logical);
		assert.equal(token.value, TV.And);
	});

	it('should recognize the not (!) operator', () => {
		const lexer = new Lexer('!');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Not);
		assert.equal(token.value, '!');
	});

	it('should recognize the or (||) operator', () => {
		const lexer = new Lexer('||');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Logical);
		assert.equal(token.value, TV.Or);
	});

	it('should recognize the at (@) delimiter', () => {
		const lexer = new Lexer('@');

		const token = lexer.nextToken();
		console.log('tolen ', token);

		assert.equal(token.type, TT.Delimiter);
		assert.equal(token.value, '@');
	});

	it('should recognize a comma (,) delimiter', () => {
		const lexer = new Lexer(',');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Delimiter);
		assert.equal(token.value, TV.Comma);
	});

	it('should recognize a left brace ({) delimiter', () => {
		const lexer = new Lexer('{');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Delimiter);
		assert.equal(token.value, TV.LeftBrace);
	});

	it('should recognize a right brace (}) delimiter', () => {
		const lexer = new Lexer('}');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Delimiter);
		assert.equal(token.value, '}');
	});

	it('should recognize a left bracket ([) delimiter', () => {
		const lexer = new Lexer('[');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Delimiter);
		assert.equal(token.value, '[');
	});

	it('should recognize a right bracket (] delimiter)', () => {
		const lexer = new Lexer(']');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Delimiter);
		assert.equal(token.value, ']');
	});

	it('should recognize a left parenthesis (() delimiter', () => {
		const lexer = new Lexer('(');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Delimiter);
		assert.equal(token.value, '(');
	});

	it('should recognize a right parenthesis ()) delimiter', () => {
		const lexer = new Lexer(')');

		const token = lexer.nextToken();

		assert.equal(token.type, TT.Delimiter);
		assert.equal(token.value, ')');
	});

	it('should assign the correct line numbers', () => {
		const lexer = new Lexer('foo(a,b) {\n'
					+ 'a + b\n'
					+ ' }');

		const tokens = [];
		let token = lexer.nextToken();
		while (token.type !== TT.EndOfInput) {
			tokens.push(token);
			token = lexer.nextToken();
		}

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

});
