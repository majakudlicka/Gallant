export const InvalidFsmState = -1;

// Finite State Machine
export class FSM {
	constructor(states, initialState, acceptingStates, nextState) {
		this.states = states;
		this.initialState = initialState;
		this.acceptingStates = acceptingStates;
		this.nextState = nextState; // The transition function.
	}

	// Runs this FSM on the specified 'input' string.
	// Returns 'true' if 'input' or a subset of 'input' matches
	// the regular expression corresponding to this FSM.
	run(input) {
		let currentState = this.initialState;
		let value = '';

		for (let i = 0, { length } = input; i < length; ++i) {
			const character = input.charAt(i);
			const nextState = this.nextState(currentState, character);

			if (nextState === InvalidFsmState) {
				break;
			}

			currentState = nextState;
			value += input[i];
		}

		return { isNumberRecognized: this.acceptingStates.has(currentState), number: value, state: currentState };
	}
}
