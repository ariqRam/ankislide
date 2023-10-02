type KanjiJson = { kanji: string; reading: string; meaning: string[]; };

class KanjiDeck {
	private startingPage: number;
	private writingPageRange: string;
	private readingPageRange: string;
	private newPageRange: string;

	private writing: KanjiJson | undefined;
	private reading: KanjiJson | undefined;
	private new: KanjiJson | undefined;

	constructor(startingPage: number) {
		this.startingPage = startingPage;
		this.writingPageRange = `${startingPage}-${startingPage + 1}`;
		this.readingPageRange = `${startingPage + 2}-${startingPage + 3}`;
		this.newPageRange = `${startingPage + 4}-${startingPage + 5}`;
	}

	parseDatabaseToJSON(): void {
		this.writing = this.parseKanjiEntries(this.writingPageRange);
		this.reading = this.parseKanjiEntries(this.readingPageRange);
		this.new = this.parseKanjiEntries(this.newPageRange);
	}

	parseKanjiEntries(pageRange: string): { kanji: string, reading: string, meaning: string[] } | undefined {
		const pattern = /(\S+) \((\S+)\): (.+?)(?=;|$)/g;

		let match;
		if ((match = pattern.exec(pageRange)) !== null) {
			const kanji = match[1];
			const reading = match[2];
			const meanings = match[3].split(';').map(str => str.trim());

			return { kanji, reading, meaning: meanings }
		} else {
			console.log("parseKanjiEntries failed to parse text");
		}
	}
}

export { KanjiDeck };