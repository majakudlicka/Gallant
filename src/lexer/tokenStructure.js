export const TokenStructure = {
	// Keywords
	Keyword: {
		name: 'keyword',
		values: {
			Else: 'else',
			If: 'if',
			While: 'while',
			KeywordAnd: 'and'
		}
	},
	Constant: {
		name: 'constant',
		values: {
			Null: 'null',
			True: 'true',
			False: 'false'
		}
	},
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
			Colon: ':',
			At: '@'
		}
	},
	// Variable declaration
	Greeting: {
		name: 'greeting',
		values: {
			Hola: 'hola',
			Hello: 'hello',
			Hi: 'hi',
			Aloha: 'aloha',
			WaveEmoji: '👋'
		}
	},
	// End of block
	Gratitude: {
		name: 'gratitude',
		values: {
			ThankYou: 'thank you',
			Thanks: 'thanks',
			Cheers: 'cheers',
			HugEmoji: '🤗',
			HeartEmoji: '❤️',
			HeartFaceEmoji: '🥰'
		}
	},
	// Variable clean-up
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
	// Function invocation
	Plead: {
		name: 'plead',
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
const allValues = {};
Object.values(TokenStructure).forEach(group => {
	Object.assign(allValues, group.values);
});

// Export TokenTypes
export const TokenTypes = Object.assign(
	{},
	...Object.entries(TokenStructure).map(([k, v]) => ({ [k]: v.name }))
);
// Export TokenValues
export const TokenValues = allValues;
