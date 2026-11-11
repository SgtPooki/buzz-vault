import { readFileSync } from 'node:fs';
import * as Piece from '@filoz/synapse-core/piece';
const f = process.argv[2]; const bytes = new Uint8Array(readFileSync(f));
console.log(f, bytes.length, (await Piece.calculate(bytes)).toString());
