export class Token {
	constructor(type, value, line) {
		this.type = type;
		this.value = value;
		this.line = line;
	}

	toString() {
		return `<${this.type}, ${this.value}, ${this.line}>`;
	}
}
