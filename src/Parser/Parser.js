import { Token } from '../Lexer/token';
import {Lexer } from "../Lexer/lexer";

export class Parser {
	constructor(input) {
		this.lexer = new Lexer(input);
		this.currentToken = this.lexer.nextToken();
	}

	parse() {
		console.log('currentToken ', this.currentToken);
		// return this.input;
	}
}

