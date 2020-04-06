import fs from 'fs';
import { Repl } from './repl';

(() => {
	if (process.argv.length < 2) return console.log('Error: No file provided');
	try {
		const repl = new Repl();
		console.log('Processing program...');
		const input = fs.readFileSync(process.argv[2], 'utf-8');
		return repl.execute(input);
	} catch (err) {
		return console.log(err);
	}
})();
