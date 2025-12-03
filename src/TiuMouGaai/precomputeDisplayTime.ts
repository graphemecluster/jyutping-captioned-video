import type { KaraokeLineWithDisplayLineIndex, KaraokeParagraph } from "./types";

export default function precomputeDisplayTime(paragraphs: KaraokeParagraph[], maxDisplayLines: number): KaraokeLineWithDisplayLineIndex[] {
	return paragraphs.flatMap(({ lines }, i) =>
		lines.map(({ segments }, j) => ({
			segments,
			start: j < maxDisplayLines
				? (lines[0].start * 3 + (paragraphs[i - 1]?.lines.at(-1)!.end ?? -Infinity) * 2) / 5
				: maxDisplayLines > 1
				// : (lines[j - 1].start * 7 + lines[j - maxDisplayLines + 1].end * 8) / 15,
				? (lines[j - 1].start + lines[j - maxDisplayLines + 1].end) / 2
				// : (lines[j].start * 8 + lines[j - 1].end * 7) / 15,
				: (lines[j].start + lines[j - 1].end) / 2,
			end: j >= lines.length - maxDisplayLines
				? ((paragraphs[i + 1]?.lines[0].start ?? Infinity) * 2 + lines.at(-1)!.end * 3) / 5
				: maxDisplayLines > 1
				// : (lines[j + maxDisplayLines - 1].start * 8 + lines[j + 1].end * 7) / 15,
				? (lines[j + maxDisplayLines - 1].start + lines[j + 1].end) / 2
				// : (lines[j + 1].start * 7 + lines[j].end * 8) / 15,
				: (lines[j + 1].start + lines[j].end) / 2,
			displayLineIndex: j % maxDisplayLines,
		}))
	);
}
