import PptxGenJS from "pptxgenjs";
import { KanjiDeck } from "./classes/kanjiDeck";

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
const Oct2StartingPage = 59;
const deck = new KanjiDeck(Oct2StartingPage);
const files: string[] = fs.readdirSync(folderPath);

files.forEach(file => {
	const filePath = path.join(folderPath, file);

	let csvContent: string = fs.readFileSync(filePath, 'utf8');
	let rows: string[] = csvContent.split('\n').slice(0, -1);

	const randRows = shuffleArray(rows);


	let index = 0;
	while (index < randRows.length) {
		const N = 100;
		let pptx = new PptxGenJS();

		createNSlides(N, index, randRows, pptx);

		pptx.writeFile({ fileName: `./output/${file}.pptx` });
		index += N;
	}

});

function createNSlides(N: number, index: number, contents: string[], pptx: PptxGenJS) {
	for (let row of contents.slice(index, index + N > contents.length ? contents.length : index + N)) {
		let slide = pptx.addSlide();
		row = row.replaceAll(",\"", "|");
		createSlide(row, slide);
	}
}

function createSlide(row: string, slide: PptxGenJS.Slide) {
	let [kanji, reading, meaning] = row.split('|');
	kanji = kanji.replaceAll("\"", "");
	reading = reading.replaceAll("\"", "");
	meaning = meaning.replaceAll("\"", "");
	const card = `${kanji}\n${reading}`;
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