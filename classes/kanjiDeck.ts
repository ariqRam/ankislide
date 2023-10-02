import PptxGenJS from "pptxgenjs";
import { createSlides } from "../utils";

const fs = require('fs');

type KanjiJson = { pageRange: string, kanji: string; reading: string; meaning: string[]; };

class KanjiDeck {
	private database: string;

	private startingPage: number;
	private writingPageRange: string;
	private readingPageRange: string;
	private newPageRange: string;

	public writing: KanjiJson[] | undefined;
	private reading: KanjiJson[] | undefined;
	private new: KanjiJson[] | undefined;

	private writingPptx: PptxGenJS = new PptxGenJS();
	private readingPptx: PptxGenJS = new PptxGenJS();
	private newPptx: PptxGenJS = new PptxGenJS();

	constructor(database: string, startingPage: number) {
		this.database = database

		this.startingPage = startingPage;


		this.writingPageRange = `${startingPage}-${startingPage + 1}`; // generate writing page range, e.g. "7-8"
		this.readingPageRange = `${startingPage + 2}-${startingPage + 3}`; // "9-10"
		this.newPageRange = `${startingPage + 4}-${startingPage + 5}`; // "11-12"
		this.parseDatabaseToJSON(); // generate KanjiJson
	}

	createPptxByKanjiJson(kanjiJsons: KanjiJson[], pptx: PptxGenJS): PptxGenJS {
		createSlides(kanjiJsons, pptx);
		return pptx;
	}

	createAllPptx(): PptxGenJS[] {
		this.writingPptx = this.createPptxByKanjiJson(this.writing!, this.writingPptx);
		this.readingPptx = this.createPptxByKanjiJson(this.reading!, this.readingPptx);
		this.newPptx = this.createPptxByKanjiJson(this.new!, this.newPptx);
		return [this.writingPptx, this.readingPptx, this.newPptx];
	}

	parseDatabaseToJSON(): void {
		this.writing = this.parseKanjiEntries(this.writingPageRange);
		this.reading = this.parseKanjiEntries(this.readingPageRange);
		this.new = this.parseKanjiEntries(this.newPageRange);
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