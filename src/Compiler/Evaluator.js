import { Lexer } from '../../src/Lexer/lexer';
const parse = require('../Parser/Parser');

const evaluate = function (parseTree) {
	const operators = {
		'+': function (a, b) {
			return a + b;
		},
		'-': function (a, b) {
			if (typeof b === 'undefined') return -a;
			return a - b;
		},
		'*': function (a, b) {
			return a * b;
		},
		'/': function (a, b) {
			return a / b;
		},
		'%': function (a, b) {
			return a % b;
		},
		'^': function (a, b) {
			return Math.pow(a, b);
		}
	};

	const variables = {
		pi: Math.PI,
		e: Math.E
	};

	const functions = {
		sin: Math.sin,
		cos: Math.cos,
		tan: Math.cos,
		asin: Math.asin,
		acos: Math.acos,
		atan: Math.atan,
		abs: Math.abs,
		round: Math.round,
		ceil: Math.ceil,
		floor: Math.floor,
		log: Math.log,
		exp: Math.exp,
		sqrt: Math.sqrt,
		max: Math.max,
		min: Math.min,
		random: Math.random
	};
	let args = {};

	var parseNode = function (node) {
		if (node.type === 'number') return node.value;
		if (operators[node.type]) {
			if (node.left) return operators[node.type](parseNode(node.left), parseNode(node.right));
			return operators[node.type](parseNode(node.right));
		}
		if (node.type === 'identifier') {
			const value = args.hasOwnProperty(node.value) ? args[node.value] : variables[node.value];
			if (typeof value === 'undefined') throw `${node.value} is undefined`;
			return value;
		}
		if (node.type === 'assign') {
			variables[node.name] = parseNode(node.value);
		} else if (node.type === 'call') {
			for (let i = 0; i < node.args.length; i++) node.args[i] = parseNode(node.args[i]);
			return functions[node.name].apply(null, node.args);
		} else if (node.type === 'function') {
			functions[node.name] = function () {
				for (let i = 0; i < node.args.length; i++) {
					args[node.args[i].value] = arguments[i];
				}
				const ret = parseNode(node.value);
				args = {};
				return ret;
			};
		}
	};

	let output = '';
	for (let i = 0; i < parseTree.length; i++) {
		const value = parseNode(parseTree[i]);
		if (typeof value !== 'undefined') output += `${value}\n`;
	}
	return output;
};

const calculate = function (input) {
	try {
		const lexer = new Lexer(input);
		const tokens = lexer.tokenize();
		const parseTree = parse(tokens);
		return evaluate(parseTree);
	} catch (e) {
		return e;
	}
};
const input = 'example = abc'
	+ 'example'

console.log(calculate(input));
