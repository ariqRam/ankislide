import PptxGenJS from "pptxgenjs";
import { createSlides } from "../utils";

const fs = require('fs');

type GoiJson = { pageRange: string, kanji: string; reading: string; meaning: string[]; };

class GoiDeck {
	private database: string;

	private startingPage: number;
	private currentPageRange: string;
	private newPageRange: string;

	public current: GoiJson[] | undefined;
	private new: GoiJson[] | undefined;

	private currentPptx: PptxGenJS = new PptxGenJS();
	private newPptx: PptxGenJS = new PptxGenJS();

	constructor(database: string, startingPage: number) {
		this.database = database

		this.startingPage = startingPage;


		this.currentPageRange = `${startingPage}-${startingPage + 14}`; // generate current page range, e.g. "7-8"
		this.newPageRange = `${startingPage + 15}-${startingPage + 29}`; // "9-10"
		this.parseDatabaseToJSON(); // generate GoiJson
	}

	createPptxByGoiJson(goiJsons: GoiJson[], pptx: PptxGenJS): PptxGenJS {
		createSlides(goiJsons, pptx);
		return pptx;
	}

	createAllPptx(): PptxGenJS[] {
		this.currentPptx = this.createPptxByGoiJson(this.current!, this.currentPptx);
		this.newPptx = this.createPptxByGoiJson(this.new!, this.newPptx);
		return [this.currentPptx, this.newPptx];
	}

	parseDatabaseToJSON(): void {
		this.current = this.parseGoiEntries(this.currentPageRange);
		this.new = this.parseGoiEntries(this.newPageRange);
	}

	parseGoiEntries(pageRange: string): GoiJson[] | undefined {
		// Use a regular expression to find the section in the full text
		const regex = new RegExp(`--- 語彙\\(${pageRange}\\) ---\n\n((?:(?!--- 語彙\\().)*\n*)`, 's');
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
export { GoiDeck, GoiJson };