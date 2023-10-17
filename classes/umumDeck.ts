const fs = require('fs');
const csv = require('csv-parser');
const { Readable } = require('stream');

interface CsvRow {
	[key: string]: string;
}

class UmumDeck {
	public results: CsvRow[] = [];
	constructor(path: string) {
		try {
			const stream = Readable.from(fs.readFileSync(path, 'utf-8'));

			stream
				.pipe(csv())
				.on('data', (data: CsvRow) => {
					console.log(data)
					this.results.push(data);
				});

			stream.on('end', () => {
				console.log('File reading complete.');
			});
		} catch (error) {
			console.error('Error reading file:', error);
		}
	}
}

export { UmumDeck };