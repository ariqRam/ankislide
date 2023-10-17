import PptxGenJS from "pptxgenjs";
import { UmumDeck } from "./classes/umumDeck";
import { createPpt } from "./utils";

const FILEPATH = 'N2.csv';

const deck = new UmumDeck(FILEPATH);
const ppt = new PptxGenJS();


createPpt(deck.results, ppt);
ppt.writeFile({ fileName: 'umum.pptx' });
