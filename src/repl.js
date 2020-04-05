import * as fs from 'fs';
import * as process from 'process';
// TODO Change to lineByLine ?
import * as readline from 'readline';
import { Interpreter } from './Interpreter/Interpreter';

export class Repl {

	run() {
		console.log('Welcome PoliteScript');
		console.log('Start typing your code');
		console.log('CTRL + C to quit');

		let prev = ' ';

		let input = '';

		const scanner = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});

		scanner.setPrompt('politeScript> ');

		scanner.prompt();

		scanner.on('line', line => {
			// Detectind double ENTER
			if (line.length === 0) {
				return this.execute(input);
				input = '';
			}
			line = line.trim();
			prev = line;

			input += line;

			try {
				if (![';', '{', '}'].includes(input.charAt(input.length - 1))) {
					this.execute(input)
					input = '';
				}
			} catch (e) {
				console.log(`error: ${e.message}`);

				input = '';
				scanner.setPrompt('politeScript> ');
			}

			scanner.prompt();
		});

		scanner.on('close', () => {
			console.log('Thanks for playing around!');
		});
	}

	execute(input) {
		const i = new Interpreter(input);
		const output = i.interpret();
		if (output !== undefined || output !== null) console.log('Executed output : ', output);
	}

}
