export const InvalidFsmState = -1;

export class FSM {
	constructor(states, initialState, acceptingStates, nextState) {
		this.states = states;
		this.initialState = initialState;
		this.acceptingStates = acceptingStates;
		this.nextState = nextState; // The transition function.
	}

	/// Runs this FSM on the specified 'input' string.
	/// Returns 'true' if 'input' or a subset of 'input' matches
	/// the regular expression corresponding to this FSM.
	run(input) {
		let currentState = this.initialState;
		let value = '';

		console.log({
			states: this.states,
			initialState: this.initialState,
			acceptingStates: this.acceptingStates,
			nextState: this.nextState
		});

		for (let i = 0, length = input.length; i < length; ++i) {
			let character = input.charAt(i);
			let nextState = this.nextState(currentState, character);

			// If the next state is one of the accepting states,
			// we return 'true' early.
			// if (this.acceptingStates.has(nextState)) {
			// 	console.log('should return true early');
			// 	return {isNumberRecognized: true, number: input, state: nextState};
			// }

			if (nextState === InvalidFsmState) {
				break;
			}

			currentState = nextState;
			value += input[i];
		}

		return {isNumberRecognized: this.acceptingStates.has(currentState), number: value, state: currentState};
	}
}
