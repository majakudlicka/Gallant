import { Token } from '../Lexer/token';
const symbols = {};

export class Parser {
	constructor(input) {
		this.input = input;
		this.position = 0;
		this.line = 0;
		this.column = 0;
	}

	parse() {
		return this.input;
	}
}

