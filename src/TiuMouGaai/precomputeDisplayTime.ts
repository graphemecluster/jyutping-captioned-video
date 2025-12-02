import type { KaraokeLineWithIndex, KaraokeParagraph } from "./types";

export default function precomputeDisplayTime(paragraphs: KaraokeParagraph[]): KaraokeLineWithIndex[] {
	return paragraphs.flatMap(({ lines }, i) =>
		lines.map(({ segments }, j) => ({
			segments,
			start: j < 2
				? (lines[0].start * 3 + (paragraphs[i - 1]?.lines.at(-1)!.end ?? -Infinity) * 2) / 5
				// : (lines[j - 1].start * 7 + lines[j - 1].end * 8) / 15,
				: (lines[j - 1].start + lines[j - 1].end) / 2,
			end: j >= lines.length - 2
				? ((paragraphs[i + 1]?.lines[0].start ?? Infinity) * 2 + lines.at(-1)!.end * 3) / 5
				// : (lines[j + 1].start * 8 + lines[j + 1].end * 7) / 15,
				: (lines[j + 1].start + lines[j + 1].end) / 2,
			index: j,
		}))
	);
}
