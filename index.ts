import PptxGenJS from "pptxgenjs";
import { GoiDeck } from "./classes/goiDeck";
import { KanjiDeck } from "./classes/kanjiDeck";
import { getWeeklyDateDepr } from "./utils";

const fs = require('fs');
const path = require('path');


// where is kanji and goi at Oct 2?
const DEFAULT_STARTING_PAGE = 59;
const DEFAULT_STARTING_PAGE_GOI = 451;
const PPT_ORDER = ['kanji-writing', 'kanji-reading', 'kanji-new', 'KANJI_ONLY_read', 'KANJI_ONLY_write', 'kanji-todaysTest'];
const PPT_ORDER_GOI = ['current', 'new'];

const kanjiTxt: string = fs.readFileSync('./kanji.txt', 'utf8');
const goiTxt: string = fs.readFileSync('./goi.txt', 'utf8');

const weeklyDate: string[] = getWeeklyDateDepr("2023-10-2", [2]);
console.log(weeklyDate)

for (let day in weeklyDate) {
	if (weeklyDate[day] === "yasumi") {
		continue;
	}
	const touDate: Date = new Date(weeklyDate.find(date => date !== "yasumi")!);
	const today: Date = new Date(weeklyDate[day]);

	const kanjiStartingPage = DEFAULT_STARTING_PAGE + 2 * (today.getDay() - 1);
	const goiStartingPage = DEFAULT_STARTING_PAGE_GOI + 15 * (today.getDay() - 1);


	const kanjiDeck = new KanjiDeck(kanjiTxt, kanjiStartingPage);
	const goiDeck = new GoiDeck(goiTxt, goiStartingPage);

	const pptxs: PptxGenJS[] = kanjiDeck.createAllPptx();
	const pptxsGoi: PptxGenJS[] = goiDeck.createAllPptx();

	//creating file and folder names
	const dateFromMonday = touDate.getDate() - touDate.getDay() + 1;
	const absPath = path.join(import.meta.dir, `${touDate.getMonth() + 1}|${dateFromMonday}-${dateFromMonday + 4}`);
	const monthlyFolderPath = `${absPath}/${weeklyDate[day]}`

	if (!fs.existsSync(monthlyFolderPath)) {
		fs.mkdirSync(monthlyFolderPath, { recursive: true });
		console.log('Folder created successfully');
	} else {
		console.log('Folder already exists');
	}

	pptxs.forEach((pptx, index) => { pptx.writeFile({ fileName: `${monthlyFolderPath}/${PPT_ORDER[index]}.pptx` }) })
	pptxsGoi.forEach((pptx, index) => { pptx.writeFile({ fileName: `${monthlyFolderPath}/goi-${PPT_ORDER_GOI[index]}.pptx` }) })
}
