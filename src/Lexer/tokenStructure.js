const tokens = {
	// Keywords
	Keyword: {
		name: 'keyword',
		values: {
			Else: 'else',
			False: 'false',
			Func: 'func',
			If: 'if',
			Null: 'null',
			This: 'this',
			True: 'true',
			While: 'while'
		}
	},
	// Accessor operators
	Accessor: { name: 'accessor', values: { At: '@', Dot: '.' } },
	// Assignment operators
	Assignment: { name: 'assignment', values: { Assignment: 'assignment' } },
	// Arithmetic operators
	Arithmetic: {
		name: 'arithmetic',
		values: {
			Div: '/',
			Modulo: '%',
			Minus: '-',
			Plus: '+',
			Times: '*'
		}
	},
	// Comparison operators
	Comparison: {
		name: 'comparison',
		values: {
			Equal: '==',
			Greater: '>',
			GreaterOrEqual: '>=',
			Less: '<',
			LessOrEqual: '<=',
			NotEqual: '!='
		}
	},
	// Logical operators
	// TODO Are they used? Do I need to add them to Parser or Interpreter
	Logical: {
		name: 'logical',
		values: {
			And: '&&',
			Not: '!',
			Or: '||'
		}
	},
	// Identifier and Literals
	Identifier: { name: 'identifier' },
	Integer: { name: 'integer' },
	Decimal: { name: 'decimal' },
	String: { name: 'string' },
	// Delimiters
	Delimiter: {
		name: 'delimiter',
		values: {
			Comma: ',',
			LeftBrace: '{',
			LeftBracket: '[',
			LeftParen: '(',
			Newline: '\n',
			RightBrace: '}',
			RightBracket: ']',
			RightParen: ')',
			SemiColon: ';',
			Colon: ':'
		}
	},
	// Greetings (variables and func declaration)
	Greeting: {
		name: 'greeting',
		values: {
			Greeting: 'greeting',
			Hola: 'hola',
			Hello: 'hello',
			Hi: 'hi',
			Aloha: 'aloha'
		}
	},
	EndOfInput: { name: 'EndOfInput' }
};

export const TokenTypes = Object.assign({}, ...Object.entries(tokens).map(([k, v]) => ({ [k]: v.name })));
export const TokenValues = Object.assign({},
	tokens.Keyword.values, tokens.Accessor.values,
	tokens.Assignment.values, tokens.Arithmetic.values,
	tokens.Comparison.values,
	tokens.Logical.values,
	tokens.Delimiter.values,
	tokens.Greeting.values);
