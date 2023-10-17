const fs = require('fs');
const csv = require('csv-parser');

interface CsvRow {
	[key: string]: string;
}

class UmumDeck {
	public results: any[] = [];
	constructor(path: string) {
		fs.createReadStream(path)
			.pipe(csv())
			.on('data', (data: CsvRow) => {
				this.results.push(data);
			})
			.on('end', () => {
				console.log(this.results);
			});
	}
}

export { UmumDeck };