import PptxGenJS from "pptxgenjs";
import { createSlides } from "../utils";

const fs = require('fs');

type KanjiJson = { pageRange: string, kanji: string; reading: string; meaning: string[]; };

class KanjiDeck {
	private database: string;

	private writingPageRange: string;
	private readingPageRange: string;
	private newPageRange: string;

	public writing: KanjiJson[] | undefined;
	private reading: KanjiJson[] | undefined;
	private new: KanjiJson[] | undefined;


	constructor(database: string, startingPage: number) {
		this.database = database

		this.writingPageRange = `${startingPage}-${startingPage + 1}`; // generate writing page range, e.g. "7-8"
		this.readingPageRange = `${startingPage + 2}-${startingPage + 3}`; // "9-10"
		this.newPageRange = `${startingPage + 4}-${startingPage + 5}`; // "11-12"
		this.parseDatabaseToJSON(); // generate KanjiJson
	}

	createPptxByKanjiJson(kanjiJsons: KanjiJson[], pptx: PptxGenJS, withoutReading: boolean = false): PptxGenJS {
		if (withoutReading) {
			kanjiJsons = kanjiJsons.filter(kanjiJson => kanjiJson.reading === null);
		}
		createSlides(kanjiJsons, pptx);
		return pptx;
	}

	createAllPptx(): PptxGenJS[] {
		const writingPptx = this.createPptxByKanjiJson(this.writing!, new PptxGenJS());
		const readingPptx = this.createPptxByKanjiJson(this.reading!, new PptxGenJS());
		const todaysTestPptx = this.createPptxByKanjiJson(this.reading!.concat(this.writing!), new PptxGenJS());
		const newPptx = this.createPptxByKanjiJson(this.new!, new PptxGenJS());
		const readingKanjiOnly = this.reading!.map((kanjiJson) => {
			kanjiJson.reading = "";
			return kanjiJson;
		})
		const writingKanjiOnly = this.writing!.map((kanjiJson) => {
			kanjiJson.reading = "";
			return kanjiJson;
		});
		const writingKanjiOnlyPptx = this.createPptxByKanjiJson(writingKanjiOnly, new PptxGenJS());
		const readingKanjiOnlyPptx = this.createPptxByKanjiJson(readingKanjiOnly, new PptxGenJS());
		return [writingPptx, readingPptx, newPptx, readingKanjiOnlyPptx, writingKanjiOnlyPptx, todaysTestPptx];
	}

	parseDatabaseToJSON(): void {
		this.writing = this.parseKanjiEntries(this.writingPageRange);
		this.reading = this.parseKanjiEntries(this.readingPageRange);
		this.new = this.parseKanjiEntries(this.newPageRange);
		console.log(this.writingPageRange);
	}

	parseKanjiEntries(pageRange: string): KanjiJson[] | undefined {
		// Use a regular expression to find the section in the full text
		const regex = new RegExp(`--- 漢字2\\(${pageRange}\\) ---\n\n((?:(?!--- 漢字2\\().)*\n*)`, 's');
		const match = this.database.match(regex);

		if (!match) return undefined;

		const sectionText = match[1];
		const lines = sectionText.trim().split('\n');

		// Map the lines to the desired structure
		return lines.map(line => {
			const [left, right] = line.split(':');
			const [kanji, reading] = left.trim().split(' ').map(s => s.replace(/[()]/g, '').trim());
			const meanings = right.split(';').map(s => s.trim());
			return {
				pageRange,
				kanji,
				reading,
				meaning: meanings
			};
		});
	}
}
export { KanjiDeck, KanjiJson };