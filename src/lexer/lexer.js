import { Token } from './token';
import { TokenTypes as TT, TokenValues as TV, TokenStructure as TS } from './tokenStructure';
import { CharUtils } from './charUtils';
import { FSM } from './fsm';


export class Lexer {
	constructor(input) {
		this.input = input;
		this.position = 0;
		this.line = 1;
	}

	// / Returns the next recognized 'Token' in the input.
	nextToken() {

		if (this.position >= this.input.length) {
			return new Token(TT.EndOfInput, TV.EndOfInput, this.line);
		}

		// We skip all the whitespaces and new lines in the input.
		this.skipWhitespaces();

		const character = this.input.charAt(this.position);


		if (CharUtils.isNewLine(character)) {
			return this.recognizeNewLine();
		}

		if (CharUtils.isLetterOrUnderscore(character)) {
			return this.recognizeIdentifier();
		}

		if (CharUtils.isValidPartOfNumber(character)) {
			return this.recognizeNumberOrDot();
		}

		if (CharUtils.isOperator(character)) {
			return this.recognizeOperator();
		}

		if (CharUtils.isDelimiter(character)) {
			return this.recognizeDelimiter();
		}

		if (character === '"') {
			return this.recognizeString();
		}

		if (CharUtils.isNonASCII(character)) {
			return this.recognizeEmoji(character);
		}

		return this.throwLexerError(character);


	}

	throwLexerError(char) {
		throw new Error(`[LEXER]: Unrecognized character ${char} at line ${this.line}`);
	}

	skipWhitespaces() {
		while (this.position < this.input.length && CharUtils.isWhitespace(this.input.charAt(this.position))) {
			this.position += 1;
		}
	}

	recognizeDelimiter() {
		const { position, line } = this;
		const character = this.input.charAt(position);
		this.position += 1;
		return new Token(TT.Delimiter, character, line);
	}


	recognizeOperator() {
		const character = this.input.charAt(this.position);

		if (CharUtils.isComparisonOperator(character)) {
			return this.recognizeComparisonOperator();
		}

		if (CharUtils.isArithmeticOperator(character)) {
			return this.recognizeArithmeticOperator();
		}

		if (CharUtils.isBooleanOperator(character)) {
			return this.recognizeBooleanOperator();
		}

		return this.throwLexerError(character);

	}

	recognizeComparisonOperator() {
		const { position, line } = this;
		const character = this.input.charAt(position);
		const lookahead = position + 1 < this.input.length ? this.input.charAt(position + 1) : null;
		const isLookaheadEqualSymbol = lookahead !== null && lookahead === '=';

		this.position += 1;

		if (isLookaheadEqualSymbol) {
			this.position += 1;
		}

		let tokenType = TT.Comparison;
		let tokenValue;
		switch (character) {
			case '>':
				tokenValue = isLookaheadEqualSymbol ? TV.GreaterOrEqual : TV.Greater;
				break;
			case '<':
				tokenValue = isLookaheadEqualSymbol ? TV.LessOrEqual : TV.Less;
				break;
			case '=':
				tokenValue = isLookaheadEqualSymbol ? TV.Equal : TV.Assignment;
				tokenType = isLookaheadEqualSymbol ? TT.Comparison : TT.Assignment;
				break;
			default:
				return this.throwLexerError(character);
		}
		return new Token(tokenType, tokenValue, line);
	}

	recognizeBooleanOperator() {
		const { position, line } = this;
		const character = this.input.charAt(position);
		const lookahead = position + 1 < this.input.length ? this.input.charAt(position + 1) : null;
		const isLookaheadEqualSymbol = lookahead !== null;

		this.position += 1;

		if (isLookaheadEqualSymbol) {
			this.position += 1;
		}

		switch (character) {
			case '!':
				return isLookaheadEqualSymbol && lookahead === '='
					? new Token(TT.Logical, TV.NotEqual, line)
					: new Token(TT.Not, '!', line);

			case '&':
				return isLookaheadEqualSymbol && lookahead === '&'
					? new Token(TT.Logical, TV.And, line)
					: new Error(`Unrecognized character ${character} at line ${this.line}.`);

			case '|':
				return isLookaheadEqualSymbol
					? new Token(TT.Logical, TV.Or, line)
					: new Error(`Unrecognized character ${character} at line ${this.line}.`);


			default:
				return this.throwLexerError(character);
		}

	}

	recognizeArithmeticOperator() {
		const { position, line } = this;
		const character = this.input.charAt(position);
		this.position += 1;
		return new Token(TT.Arithmetic, character, line);
	}

	recognizeNewLine() {
		const { line, position } = this;
		const character = this.input.charAt(position);
		this.position += 1;
		this.line += 1;
		return new Token(TT.Delimiter, character, line);
	}

	recognizeDot() {
		const { line } = this;
		this.position += 1;
		return new Token(TT.Accessor, TV.Dot, line);
	}

	recognizeIdentifier() {
		let identifier = '';
		const { line } = this;
		let { position } = this;

		while (position < this.input.length) {
			const character = this.input.charAt(position);

			if (!CharUtils.isIdentifier(character)) {
				break;
			}

			identifier += character;
			position += 1;
		}

		this.position += identifier.length;
		let tokenType;

		if (Object.values(TS.Keyword.values).includes(identifier)) {
			tokenType = TT.Keyword;

		}

		if (Object.values(TS.Constant.values).includes(identifier)) {
			tokenType = TT.Constant;
		}

		if (Object.values(TS.Greeting.values).includes(identifier)) {
			tokenType = TT.Greeting;
		}

		if (Object.values(TS.Plead.values).includes(identifier)) {
			tokenType = TT.Plead;
		}

		if (Object.values(TS.Gratitude.values).includes(identifier)) {
			tokenType = TT.Gratitude;
		}

		if (Object.values(TS.Farewell.values).includes(identifier)) {
			tokenType = TT.Farewell;
		}

		if (tokenType) return new Token(tokenType, identifier, line);

		// Special case for special "thank you" token including space inbetween
		const lookahead = position + 4 >= this.input.length ? this.input.substring(position + 1, position + 5) : null;
		if (identifier === 'thank' && lookahead === 'you') {
			return new Token(TT.Gratitude, 'thank you', line);
		}

		return new Token(TT.Identifier, identifier, line);
	}

	recognizeNumberOrDot() {
		const { line } = this;
		const fsm = this.buildNumberRecognizer();
		const fsmInput = this.input.substring(this.position);
		const { isNumberRecognized, number, state } = fsm.run(fsmInput);

		if (isNumberRecognized) {
			this.position += number.length;
			let tokenType;
			if (state === 2) {
				tokenType = TT.Integer;
			} else if (state === 4) {
				tokenType = TT.Decimal;
			}
			return new Token(tokenType, number, line);
		} if (number === TV.Dot && state === 3) {
			return this.recognizeDot();
		}
		return this.throwLexerError(number);
	}

	recognizeString() {
		let string = '"';
		const { line } = this;
		let position = this.position + 1;

		while (position < this.input.length) {
			const character = this.input.charAt(position);

			if (character === '"') {
				string += character;
				break;
			}

			string += character;
			position += 1;
		}

		this.position += string.length;

		return new Token(TT.String, string, line);
	}

	recognizeEmoji() {
		const { line } = this;
		let { position } = this;
		const char = this.input.charAt(position);
		let emoji = `${char}`;

		position = this.position + 1;

		while (position < this.input.length) {
			const character = this.input.charAt(position);

			if (CharUtils.isWhitespace(character) || CharUtils.isNewLine(character)) {
				break;
			}

			emoji += character;
			position += 1;
		}

		this.position += emoji.length;
		if (CharUtils.isWaveHandEmoji(emoji)) {
			return new Token(TT.Greeting, TV.WaveEmoji, line);
		} if (CharUtils.isPleaseEmoji(emoji)) {
			return new Token(TT.Plead, TV.PleaseEmoji, line);
		} if (CharUtils.isHeartFaceEmoji(emoji)) {
			return new Token(TT.Gratitude, TV.HeartFaceEmoji, line);
		} if (CharUtils.isHeartEmoji(emoji)) {
			return new Token(TT.Gratitude, TV.HeartEmoji, line);
		} if (CharUtils.isHugEmoji(emoji)) {
			return new Token(TT.Gratitude, TV.HugEmoji, line);
		} if (CharUtils.isByeEmoji(emoji)) {
			return new Token(TT.Farewell, TV.ByeEmoji, line);
		} if (CharUtils.isKissEmoji(emoji)) {
			return new Token(TT.Farewell, TV.KissEmoji, line);
		} if (CharUtils.isCommonEmoji(emoji)) {
			return new Token(TT.CommonEmoji, emoji, line);
		}

		return this.throwLexerError(char);
	}

	// Use Finite State Machine to recognize different types of numbers
	buildNumberRecognizer() {
		// We name our states for readability.
		const State = {
			Initial: 1,
			Integer: 2,
			BeginNumberWithFractionalPart: 3,
			NumberWithFractionalPart: 4,
			NoNextState: -1
		};

		const fsm = new FSM();
		fsm.states = new Set([State.Initial, State.Integer, State.BeginNumberWithFractionalPart,
			State.NumberWithFractionalPart, State.NoNextState]);
		fsm.initialState = State.Initial;
		fsm.acceptingStates = new Set([State.Integer, State.NumberWithFractionalPart]);
		fsm.nextState = (currentState, character) => {
			switch (currentState) {
				case State.Initial:
					if (CharUtils.isDigit(character)) {
						return State.Integer;
					}

					if (character === '.') {
						return State.BeginNumberWithFractionalPart;
					}

					break;

				case State.Integer:
					if (CharUtils.isDigit(character)) {
						return State.Integer;
					}

					if (character === '.') {
						return State.BeginNumberWithFractionalPart;
					}

					break;

				case State.BeginNumberWithFractionalPart:
					if (CharUtils.isDigit(character)) {
						return State.NumberWithFractionalPart;
					}

					break;

				case State.NumberWithFractionalPart:
					if (CharUtils.isDigit(character)) {
						return State.NumberWithFractionalPart;
					}

					break;


				default:
					break;
			}

			return State.NoNextState;
		};

		return fsm;
	}


}
