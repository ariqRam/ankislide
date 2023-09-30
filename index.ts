import PptxGenJS from "pptxgenjs";
const fs = require('fs')

function shuffleArray<T>(originalArray: ReadonlyArray<T>): T[] {
	let array = [...originalArray];  // Create a copy

	for (let i = array.length - 1; i > 0; i--) {
		const randomIndex = Math.floor(Math.random() * (i + 1));
		[array[i], array[randomIndex]] = [array[randomIndex], array[i]];
	}

	return array;
}

let csvContent: string = fs.readFileSync('./N2.csv', 'utf8');
let rows: string[] = csvContent.split('\n').slice(0, -1);

const randRows = shuffleArray(rows);


let index = 0;
while (index < randRows.length) {

	let pptx = new PptxGenJS();
	for (const row of randRows.slice(index, index + 20)) {
		let slide = pptx.addSlide();
		const [kanji, reading, definition] = row.split(',');
		slide.addText(`${kanji.replaceAll("\"", "")}\n${reading.replaceAll("\"", "")}\n${definition.replaceAll("\"", "")}`, {
			x: 0,
			y: 1,
			w: "100%",
			h: 2,
			align: "center",
			color: "000000",
			fontSize: 48,
		});
	}
	pptx.writeFile({ fileName: `PptxGenJS-Demo${index}.pptx` });
	index += 20;
}
