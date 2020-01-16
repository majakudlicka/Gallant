const isOperator = function (c) {
	return /[+\-*\/\^%=(),]/.test(c);
};
const isDigit = function (c) {
	return /[0-9]/.test(c);
};
const isWhiteSpace = function (c) {
	return /\s/.test(c);
};
const isIdentifier = function (c) {
	return typeof c === 'string' && !isOperator(c) && !isDigit(c) && !isWhiteSpace(c);
};

const lex = function (input) {
	const tokens = [];
	let c = 0;
	let i = 0;

	const advance = function () { return c = input[++i]; };
	const addToken = function (type, value) {
		tokens.push({
			type,
			value
		});
	};

	while (i < input.length) {
		c = input[i];
		if (isWhiteSpace(c)) advance();
		else if (isOperator(c)) {
			addToken(c);
			advance();
		} else if (isDigit(c)) {
			let num = c;
			while (isDigit(advance())) num += c;
			if (c === '.') {
				do num += c; while (isDigit(advance()));
			}
			num = parseFloat(num);
			if (!isFinite(num)) throw 'Number is too large or too small for a 64-bit double.';
			addToken('number', num);
		} else if (isIdentifier(c)) {
			let idn = c;
			while (isIdentifier(advance())) idn += c;
			addToken('identifier', idn);
		} else throw 'Unrecognized token.';
	}
	addToken('(end)');
	return tokens;
};

console.log(lex('(12 % 7) * (3 + 2)'));
