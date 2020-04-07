import process from 'process';
import readline from 'readline';
import emoji from 'node-emoji';
import { Interpreter } from './Interpreter/Interpreter';

const { log } = console;

export class Repl {

	run() {
		log('Welcome PoliteScript');
		log('Start typing your code');
		log('CTRL + C to quit');

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



			input = emoji.emojify(input);

			// Detecting double ENTER
			if (line.length === 0) {
				this.execute(input, scanner);
				input = '';
			} else if (line.startsWith(':emoji')) {
				const emojiSearch = input.substring(7);
				console.log('emojiSearch ', emojiSearch);
				const result = emoji.search(input.substring(7));
				console.log('result ', result);
				const choices = [];
				if (result.length > 0) {
					result.forEach((item, index) => {
						choices.push(`${index+1} ${item.emoji}`);
					});
				}
				console.log(`Emojis starting with "${emojiSearch}": ${choices}`);
				scanner.question('Select the number of the emoji you want to pick (1,2,3...)', (answer => {
					console.log('Selected: ', result[answer-1].emoji);
				}))
			}
			else if (![';', '{', '}'].includes(input.charAt(input.length - 1))) {
				this.execute(input, scanner);
				input = '';
			}
		});

		scanner.on('close', () => {
			log('Thanks for playing around! 🤗🤗🤗');
		});
	}

	execute(input, scanner) {
		try {
			log(`Processing input: ${input.length > 15 ? `${input.substring(0, 15)}...` : input}`);
			const i = new Interpreter(input);
			const output = i.interpret();
			if (output !== undefined && output !== null) log('Executed output : ', output);
		} catch (err) {
			log(err);
			scanner.setPrompt('politeScript> ');
		}
		scanner.prompt();
	}

}
