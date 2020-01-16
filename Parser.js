const parse = function (tokens) {

	const symbols = {};
	const symbol = function (id, nud, lbp, led) {
		const sym = symbols[id] || {};
		symbols[id] = {
			lbp: sym.lbp || lbp,
			nud: sym.nud || nud,
			led: sym.led || led
		};
	};

	const interpretToken = function (token) {
		const sym = Object.create(symbols[token.type]);
		sym.type = token.type;
		sym.value = token.value;
		return sym;
	};

	let i = 0; const
		token = function () { return interpretToken(tokens[i]); };
	const advance = function () { i++; return token(); };

	const expression = function (rbp) {
		let left; let
			t = token();
		advance();
		if (!t.nud) throw `Unexpected token: ${t.type}`;
		left = t.nud(t);
		while (rbp < token().lbp) {
			t = token();
			advance();
			if (!t.led) throw `Unexpected token: ${t.type}`;
			left = t.led(left);
		}
		return left;
	};

	const infix = function (id, lbp, rbp, led) {
		rbp = rbp || lbp;
		symbol(id, null, lbp, led || (left => ({
			type: id,
			left,
			right: expression(rbp)
		})));
	};
	const prefix = function (id, rbp) {
		symbol(id, () => ({
			type: id,
			right: expression(rbp)
		}));
	};

	prefix('-', 7);
	infix('^', 6, 5);
	infix('*', 4);
	infix('/', 4);
	infix('%', 4);
	infix('+', 3);
	infix('-', 3);

	symbol(',');
	symbol(')');
	symbol('(end)');

	symbol('(', () => {
		value = expression(2);
		if (token().type !== ')') throw "Expected closing parenthesis ')'";
		advance();
		return value;
	});
	symbol('number', number => number);

	symbol('identifier', name => {
		if (token().type === '(') {
			const args = [];
			if (tokens[i + 1].type === ')') advance();
			else {
				do {
					advance();
					args.push(expression(2));
				} while (token().type === ',');
				if (token().type !== ')') throw "Expected closing parenthesis ')'";
			}
			advance();
			return {
				type: 'call',
				args,
				name: name.value
			};
		}
		return name;
	});
	infix('=', 1, 2, left => {
		if (left.type === 'call') {
			for (let i = 0; i < left.args.length; i++) {
				if (left.args[i].type !== 'identifier') throw 'Invalid argument name';
			}
			return {
				type: 'function',
				name: left.name,
				args: left.args,
				value: expression(2)
			};
		} if (left.type === 'identifier') {
			return {
				type: 'assign',
				name: left.value,
				value: expression(2)
			};
		} throw 'Invalid lvalue';
	});

	const parseTree = [];
	while (token().type !== '(end)') {
		parseTree.push(expression(0));
	}
	return parseTree;
};

console.log(parse([ { type: '(', value: undefined },
	{ type: 'number', value: 12 },
	{ type: '%', value: undefined },
	{ type: 'number', value: 7 },
	{ type: ')', value: undefined },
	{ type: '*', value: undefined },
	{ type: '(', value: undefined },
	{ type: 'number', value: 3 },
	{ type: '+', value: undefined },
	{ type: 'number', value: 2 },
	{ type: ')', value: undefined },
	{ type: '(end)', value: undefined }]));
