import * as assert from 'assert';
// import { TokenType } from '../../src/Lexer/tokentype';
// import { Lexer } from '../../src/Lexer/lexer';
import { Parser } from '../../Parser/Parser';
import {Token} from "../../Lexer/token";

console.log(Parser);

describe.only('Parser', () => {

	it('should parse a simple expression', () => {
		console.log('=------>>> IN the right place');
		const tokens = [new Token('integer', '42', 0, 0),
			new Token('%', '%', 0, 2),
			new Token('integer', '21', 0, 3)];

		const parser = new Parser(tokens);

		const AST = parser.parse();
		console.log('AST ', AST);

		// assert.equal(token.type, TokenType.Newline);
		// assert.equal(token.value, '\n');
	});

});
