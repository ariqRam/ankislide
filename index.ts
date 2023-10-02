import PptxGenJS from "pptxgenjs";
import { KanjiDeck } from "./classes/kanjiDeck";
import { getWeeklyDate, getWeeklyDateDepr } from "./utils";

const fs = require('fs');
const path = require('path');


const DEFAULT_STARTING_PAGE = 59;
const DEFAULT_DATE = new Date('2023-10-02');
const PPT_ORDER = ['writing', 'reading', 'new'];

const dbFile: string = fs.readFileSync('./kanji.txt', 'utf8');

const weeklyDate: string[] = getWeeklyDateDepr("this", []);
console.log(weeklyDate)

for (let day in weeklyDate) {
	if (weeklyDate[day] === "yasumi") {
		continue;
	}
	const deck = new KanjiDeck(dbFile, DEFAULT_STARTING_PAGE);

	const pptxs: PptxGenJS[] = deck.createAllPptx();
	const touDate: Date = new Date(weeklyDate.find(date => date !== "yasumi")!);
	console.log(touDate)
	const dateFromMonday = touDate.getDate() - touDate.getDay() + 1;
	// console.log(`${touDate.getMonth() + 1}|${dateFromMonday}-${dateFromMonday + 4}`);
	const absPath = path.join(import.meta.dir, `${touDate.getMonth() + 1}|${dateFromMonday}-${dateFromMonday + 4}`);
	const monthlyFolderPath = `${absPath}/${weeklyDate[day]}`
	if (!fs.existsSync(monthlyFolderPath)) {
		fs.mkdirSync(monthlyFolderPath, { recursive: true });
		console.log('Folder created successfully');
	} else {
		console.log('Folder already exists');
	}
	pptxs.forEach((pptx, index) => { pptx.writeFile({ fileName: `${monthlyFolderPath}/${PPT_ORDER[index]}.pptx` }) })
}
