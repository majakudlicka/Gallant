import process from 'process';
import readline from 'readline';
import emoji from 'node-emoji';
import clipboardy from 'clipboardy';
import { Interpreter } from './Interpreter/Interpreter';

const { log } = console;

export class Repl {

	run() {
		log('✨Welcome to Gallant✨');
		log('Start typing your code ⌨️');
		log('CTRL + C to quit 🛑');

		let input = '';

		const scanner = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});

		scanner.setPrompt('Gallant> ');
		scanner.prompt();

		scanner.on('line', l => {
			const line = l.trim();
			input += line;


			input = emoji.emojify(input);

			// Detecting double ENTER
			if (line.length === 0) {
				this.execute(input, scanner);
				input = '';
				// Emoji picker
				// Ideally use inquirer module here but needs https://github.com/SBoudrias/Inquirer.js/issues/646 fixed
			} else if (line.startsWith(':emoji')) {
				const emojiSearch = line.substring(7);
				const result = emoji.search(emojiSearch);

				const choices = [];
				if (result.length > 0) {
					result.forEach((item, index) => {
						choices.push(`${index + 1} ${item.emoji}`);
					});
				}
				log(`Emojis starting with "${emojiSearch}": ${choices.join(' ')}`);
				scanner.question('Type the number of the emoji you want to pick: ', (answer => {
					const selected = result[answer - 1].emoji;
					this.addToClipboard(selected);
					input = input.substring(0, input.length - line.length);
					log('Copied to clipboard: ', selected);
					scanner.prompt();
				}));
			} else if (![';', '{', '}'].includes(input.charAt(input.length - 1))) {
				this.execute(input, scanner);
				input = '';
			}
			scanner.prompt();
		});

		scanner.on('close', () => {
			log('Thanks for playing around! 🤗🤗🤗');
		});
	}

	execute(input, scanner) {
		try {
			log(`Processing input: ${input.length > 30 ? `${input.substring(0, 15)}...` : input}`);
			const i = new Interpreter(input);
			const output = i.interpret();
			if (output !== undefined && output !== null) log('Executed output : ', output);
		} catch (err) {
			log(err);
			scanner.setPrompt('Gallant> ');
		}
		scanner.prompt();
	}

	addToClipboard(emojiText) {
		const [emojiChar, emojiName] = emojiText.split(' ');
		clipboardy.writeSync(emojiChar);
		const emojiNameText = emojiName ? ` (${emojiName})` : '';
		log(`${emojiChar}${emojiNameText} copied to clipboard`);
	}

}
