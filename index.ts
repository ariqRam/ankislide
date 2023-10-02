import PptxGenJS from "pptxgenjs";
import { KanjiDeck } from "./classes/kanjiDeck";

const fs = require('fs');
const path = require('path');



const folderPath = './';
const oct2StartingPage = 59;
const dbFile: string = fs.readFileSync('./kanji.txt', 'utf8');
const deck = new KanjiDeck(dbFile, oct2StartingPage);


console.log(deck.writing);

deck.createAllPptx();
deck.saveAllPptx(path.join(folderPath, 'output'));
