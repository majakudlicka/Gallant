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
			line = line.trim();
			prev = line;

			input += line;

			try {
				console.log('input in repl ', input);
				const i = new Interpreter(input);
				const output = i.interpret();
				if (output) console.log(output);
				input = '';
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

}
