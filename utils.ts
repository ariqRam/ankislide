import PptxGenJS from "pptxgenjs";
import { KanjiDeck, KanjiJson } from "./classes/kanjiDeck";

const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function getUserInput(): number[] {
	let prompt: string = 'Is there a holiday this week? (1 for yes, 0 for no): ';
	const holidayExists: boolean = rl.question(prompt, (answer: string) => {
		rl.close();
		return !!parseInt(answer);
	})

	if (holidayExists) {
		prompt = 'Which days (except for 土日)? (separated by space, use "0 1 2 3 4"): ';
		const days: number[] = rl.question(prompt, (answer: string) => {
			rl.close();
			return answer.split(' ').forEach(day => {
				return parseInt(day);
			});
		});
		return days;
	}

	return [];
}

function getWeeklyDateDepr(starting: string, yasumi: number[]): string[] {
	let touDate = new Date();
	if (starting) {
		touDate = new Date(starting);
	}
	// set date to monday
	touDate.setDate(touDate.getDate() - touDate.getDay() + 1);

	const thisWeekDates: Date[] = Array<Date>(5);

	for (let i = 0; i < 5; i++) {
		thisWeekDates[i] = new Date(touDate);
		touDate.setDate(touDate.getDate() + 1);
	}

	const thisWeekDatesFormatted: string[] = thisWeekDates.map(date => {
		return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
	});

	yasumi.forEach(day => {
		thisWeekDatesFormatted[day] = "yasumi";
	})

	return thisWeekDatesFormatted;
}

function getMonthlyDateWithYasumi(month: number, starting: string, yasumi: number[][]): Date[][] {
	const lastDayOfMonth = new Date(2023, month + 1, 0);

	let touDate = lastDayOfMonth;
	// set date to monday
	touDate.setDate(touDate.getDate() - touDate.getDay() + 1);

	let allWeekdaysInAMonth: Date[][] = [];

	while (touDate.getDay() !== 0) {
		const thisWeekDates: Date[] = Array<Date>(5);
		const dayOfWeek = touDate.getDay();
		const diff = touDate.getDate() - dayOfWeek + (dayOfWeek === 1 ? 0 : (dayOfWeek === 0 ? -6 : 1));
		const monday = new Date(touDate.setDate(diff));

		for (let i = 0; i < 5; i++) {
			thisWeekDates[i] = new Date(monday);
			monday.setDate(monday.getDate() + 1);
		}
	}
	return allWeekdaysInAMonth;
}

function getWeeklyDate(): string[] {
	const touDate = new Date();
	// set date to monday
	touDate.setDate(touDate.getDate() - touDate.getDay() + 1);

	const thisWeekDates: Date[] = Array<Date>(5);

	for (let i = 0; i < 5; i++) {
		thisWeekDates[i] = new Date(touDate);
		touDate.setDate(touDate.getDate() + 1);
	}

	const thisWeekDatesFormatted: string[] = thisWeekDates.map(date => {
		return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
	})

	getUserInput().forEach(day => {
		thisWeekDatesFormatted[day] = "yasumi";
	})

	return thisWeekDatesFormatted; // ["2021-1-1", "2021-1-2", "2021-1-3", "2021-1-4", "yasumi"]
}

function shuffleArray<T>(originalArray: ReadonlyArray<T>): T[] {
	let array = [...originalArray];  // Create a copy

	for (let i = array.length - 1; i > 0; i--) {
		const randomIndex = Math.floor(Math.random() * (i + 1));
		[array[i], array[randomIndex]] = [array[randomIndex], array[i]];
	}

	return array;
}

function createSlides(kanjiJsons: KanjiJson[], pptx: PptxGenJS) {
	for (let kanjiJson of kanjiJsons) {
		const slide = pptx.addSlide();
		createSlide(kanjiJson, slide);
	}
}

function createSlide(kanjiJson: KanjiJson, slide: PptxGenJS.Slide) {
	slide.addText(`${kanjiJson.kanji}`, {
		x: 0,
		y: 0.6,
		w: "100%",
		h: 2,
		align: "center",
		color: "000000",
		fontSize: 48,
	});
	slide.addText(`\n\n${kanjiJson.reading}`, {
		x: 0,
		y: 1,
		w: "100%",
		h: 2,
		align: "center",
		color: "404040",
		fontSize: 36,
	})
	slide.addText(`${kanjiJson.meaning.join(" | ").slice(0, 121)}...`, {
		x: 0,
		y: 3,
		w: "100%",
		h: 2,
		align: "center",
		color: "808080",
		fontSize: 36,
	});
	slide.addText(kanjiJson.pageRange, {
		x: 0,
		y: 4,
		w: "95%",
		h: 2,
		align: "right",
		color: "808080",
		fontSize: 24,
	})
}

function printFormattedKanji(kanjiDeck: KanjiDeck) {
	function printKanji(kanjiJson: KanjiJson, pageRange: string) {
		process.stdout.write(`${pageRange} ${kanjiJson.kanji} ${kanjiJson.reading} | `);
	}
	const writing = kanjiDeck.writing;
	const reading = kanjiDeck.reading;
	if (writing && reading) {
		printKanji(writing[0], kanjiDeck.writingPageRange);
		printKanji(reading[0], kanjiDeck.readingPageRange);
		console.log();
	}
}

export { getUserInput, getWeeklyDate, getWeeklyDateDepr, shuffleArray, createSlides, printFormattedKanji };