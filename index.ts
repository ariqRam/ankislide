import PptxGenJS from "pptxgenjs";
const fs = require('fs');
const path = require('path');

function shuffleArray<T>(originalArray: ReadonlyArray<T>): T[] {
	let array = [...originalArray];  // Create a copy

	for (let i = array.length - 1; i > 0; i--) {
		const randomIndex = Math.floor(Math.random() * (i + 1));
		[array[i], array[randomIndex]] = [array[randomIndex], array[i]];
	}

	return array;
}

const folderPath = './input';
const files: string[] = fs.readdirSync(folderPath);

files.forEach(file => {
	const filePath = path.join(folderPath, file);

	let csvContent: string = fs.readFileSync(filePath, 'utf8');
	let rows: string[] = csvContent.split('\n').slice(0, -1);

	const randRows = shuffleArray(rows);


	let index = 0;
	const numOfWordsPerPpt = 100;
	while (index < randRows.length) {

		let pptx = new PptxGenJS();
		for (let row of randRows.slice(index, index + numOfWordsPerPpt > randRows.length ? randRows.length : index + numOfWordsPerPpt)) {
			let slide = pptx.addSlide();
			row = row.replaceAll(",\"", "|")
			let [kanji, reading, meaning] = row.split('|');
			kanji = kanji.replaceAll("\"", "");
			reading = reading.replaceAll("\"", "");
			meaning = meaning.replaceAll("\"", "");
			const card = `${kanji}\n${reading}`
			slide.addText(`${card}`, {
				x: 0,
				y: 1,
				w: "100%",
				h: 2,
				align: "center",
				color: "000000",
				fontSize: 48,
			});
			slide.addText(`${meaning.slice(0, 121)}...`, {
				x: 0,
				y: 3,
				w: "100%",
				h: 2,
				align: "center",
				color: "000000",
				fontSize: 36,
			});
		}
		pptx.writeFile({ fileName: `./output/${file}.pptx` });
		index += numOfWordsPerPpt;
	}
});
