export var TokenValues = {

	// Keywords
	Else: 'else',
	False: 'false',
	Func: 'func',
	If: 'if',
	Null: 'null',
	This: 'this',
	True: 'true',
	While: 'while',

	// Accessor operators
	// TODO what about @?
	Accessor: 'accessor',
	Dot: 'i',
	At: '@',

	// Assignment operator
	Assignment: '=',

	// Arithmetic operators
	Div: '/',
	Modulo: '%',
	Minus: '-',
	Plus: '+',
	Times: '*',

	// Comparison operators
	Equal: '==',
	Greater: '>',
	GreaterOrEqual: '>=',
	Less: '<',
	LessOrEqual: '<=',
	NotEqual: '!=',

	// Logical operators
	// TODO Are they used? Do I need to add them to Parser or Interpreter
	And: '&&',
	Not: '!',
	Or: '||',

	// Delimiters
	Colon: ':',
	Comma: ',',
	LeftBrace: '{',
	LeftBracket: '[',
	LeftParen: '(',
	Newline: '\n',
	RightBrace: '}',
	RightBracket: ']',
	RightParen: ')',
	SemiColon: ';',

	// Greetings (variables and func declaration)
	Greeting: 'greeting',
	Hola: 'hola',
	Hello: 'hello',
	Hi: 'hi',
	Aloha: 'aloha',

	// Special token types
	EndOfInput: 'EndOfInput',
	Unrecognized: 'Unrecognized'
};
