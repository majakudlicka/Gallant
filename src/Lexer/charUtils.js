export class CharUtils {

	static isOperator(char) {
		return /[+\-*\/\^%=<>!&|]/.test(char);
	}

	static isWhitespace(char) {
			return /[ \t\r\f\v\u00A0\u2028\u2029]/.test(char);
	}

	static isArithmeticOperator(char) {
		return /[+\-*\/\^%]/.test(char);
	}

	static isDigit(char) {
		return /[0-9]/.test(char);
	}

	static isLetter(char) {
		return /[a-zA-Z]/.test(char);
	}

	static isLetterOrUnderscore(char) {
		return this.isLetter(char) || char === '_';
	}

	static isNewLine(char) {
		return /[\n;]/.test(char);
	}

	static isBooleanOperator(char) {
		return /[!&|]/.test(char);
	}

	static isComparisonOperator(char) {
		return /[<>=]/.test(char);
	}

	static isValidPartOfNumber(char) {
		return this.isDigit(char) || char === '.';
	}

	static isDelimiter(char) {
		return /[:,@{[()\]}]/.test(char);
	}

	static isNonASCII(char) {
		// eslint-disable-next-line no-control-regex
		return /[^\u0000-\u007F]+/.test(char);
	}

	static isWaveHandEmoji(char) {
		return /[👋]/u.test(char);
	}

	static isThankYouEmoji(char) {
		return /[🙏]/u.test(char);
	}
}
