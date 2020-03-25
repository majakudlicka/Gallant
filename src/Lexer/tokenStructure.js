export const TokenStructure = {
	// Keywords
	Keyword: {
		name: 'keyword',
		values: {
			Else: 'else',
			False: 'false',
			If: 'if',
			Null: 'null',
			True: 'true',
			While: 'while',
			KeywordAnd: 'and'
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
	// Greetings (keywords for variables declaration)
	Greeting: {
		name: 'greeting',
		values: {
			Greeting: 'greeting',
			Hola: 'hola',
			Hello: 'hello',
			Hi: 'hi',
			Aloha: 'aloha',
			WaveEmoji: '👋'
		}
	},
	Gratitude: {
		name: 'gratitude',
		values: {
			// TODO needs look-forward
			// ThankYou: 'thank you',
			Thanks: 'thanks',
			Cheers: 'cheers',
			HugEmoji: '🤗',
			HeartEmoji: '❤️',
			HeartFaceEmoji: '🥰'
		}
	},
	Farewell: {
		name: 'farewell',
		values: {
			Goodbye: 'goodbye',
			Bye: 'bye',
			Ciao: 'ciao',
			ByeEmoji: '✋',
			KissEmoji: '😘'
		}
	},
	// TODO Rename as plead ?
	FunctionInvocation: {
		name: 'functionInvocation',
		values: {
			Please: 'please',
			PleaseEmoji: '🙏',
			PleadEmoji: '🥺'
		}
	},
	EndOfInput: { name: 'EndOfInput' },
	// Emoji without any special meaning / function in language
	CommonEmoji: { name: 'commonEmoji' }
};

export const TokenTypes = Object.assign({}, ...Object.entries(TokenStructure).map(([k, v]) => ({ [k]: v.name })));
// TODO Can this be done better ?
export const TokenValues = Object.assign({},
	TokenStructure.Keyword.values, TokenStructure.Accessor.values, TokenStructure.Assignment.values,
	TokenStructure.Arithmetic.values, TokenStructure.FunctionInvocation.values, TokenStructure.Comparison.values,
	TokenStructure.Logical.values, TokenStructure.Delimiter.values, TokenStructure.Greeting.values, TokenStructure.Gratitude.values,
	TokenStructure.Farewell.values);
