const tokens = {

	// Keywords
	// TODO This should have name and values
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
	// Else: 'else',
	// False: 'false',
	// Func: 'func',
	// If: 'if',
	// Null: 'null',
	// This: 'this',
	// True: 'true',
	// While: 'while',

	// Accessor operators
	// TODO what about @?
	Accessor: { name: 'accessor' },

	// Assignment operators
	Assignment: { name: 'assignment' },

	// Arithmetic operators
	Arithmetic: { name: 'arithmetic' },
	// Div: '/',
	// Modulo: '%',
	// Minus: '-',
	// Plus: '+',
	// Times: '*',

	// Comparison operators
	Comparison: { name: 'comparison' },
	// Equal: '==',
	// Greater: '>',
	// GreaterOrEqual: '>=',
	// Less: '<',
	// LessOrEqual: '<=',
	// NotEqual: '!=',

	// Logical operators
	// TODO Are they used? Do I need to add them to Parser or Interpreter
	Logical: { name: 'logical' },
	// And: '&&',
	// Not: '!',
	// Or: '||',

	// Identifier and Literals
	Identifier: { name: 'identifier' },
	Integer: { name: 'integer' },
	Decimal: { name: 'decimal' },
	String: { name: 'string' },

	// Delimiters
	Delimiter: { name: 'delimiter' },
	// Colon: ':',
	// Comma: ',',
	// LeftBrace: '{',
	// LeftBracket: '[',
	// LeftParen: '(',
	// Newline: '\n',
	// RightBrace: '}',
	// RightBracket: ']',
	// RightParen: ')',
	// SemiColon: ';',

	// Greetings (variables and func declaration)
	Greeting: { name: 'greeting' },

	// Special token types
	EndOfInput: { name: 'EndOfInput' }
	// Unrecognized: 'Unrecognized'
};

export const TokenTypes = Object.assign({}, ...Object.entries(tokens).map(([k, v]) => ({ [k]: v.name })));
export const TokenValues = {...tokens.Keyword.values};

console.log('TokenValues in file are ', TokenValues);
