import process from 'process';
// TODO Change to lineByLine ?
import readline from 'readline';
import { Interpreter } from './Interpreter/Interpreter';

export class Repl {

	run() {
		console.log('Welcome PoliteScript');
		console.log('Start typing your code');
		console.log('CTRL + C to quit');

		let input = '';

		const scanner = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});

		// TODO CourtesyScript ?
		scanner.setPrompt('politeScript> ');
		scanner.prompt();

		scanner.on('line', l => {
			const line = l.trim();
			input += line;

			// Detectind double ENTER
			if (line.length === 0) {
				this.execute(input, scanner);
				input = '';
			} else if (![';', '{', '}'].includes(input.charAt(input.length - 1))) {
				this.execute(input, scanner);
				input = '';
			}
		});

		scanner.on('close', () => {
			console.log('Thanks for playing around!');
		});
	}

	execute(input, scanner) {
		try {
			const i = new Interpreter(input);
			const output = i.interpret();
			if (output !== undefined || output !== null) console.log('Executed output : ', output);
		} catch (err) {
			console.log(err);
			scanner.setPrompt('politeScript> ');
		}
		scanner.prompt();
	}

}
