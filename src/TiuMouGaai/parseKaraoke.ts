// Time unit: ticks (raw values from data file)

import type { KaraokeAnimatedTextSegment, KaraokeParagraph, KaraokeRuby, KaraokeTextSegment } from "./types";

export default function parseKaraoke(input: string): KaraokeParagraph[] {
	const paragraphs = input.trim().split(/(?:(?:\r?\n|\r|\u2028){2}|\u2029)[\r\n\u2028\u2029]*/);

	return paragraphs.map(paragraph => {
		const lines = paragraph.trim().split(/\r?\n|\r|\u2028/);

		return {
			lines: lines.map(line => {
				const segments: (KaraokeTextSegment | KaraokeAnimatedTextSegment | KaraokeRuby)[] = [];
				let lineStart = Infinity;
				let lineEnd = 0;

				// Parse pattern: [rubyBase{start|end|note|rubyText1}{start|end|note|rubyText2}] or {start|end|note|text}
				for (const match of line.matchAll(/\[([^[\]{}]+)(?:\{[^}]+\})+\]|\{([^}]+)\}|([^[\]{}]+)/g)) {
					if (match[1]) {
						const rubyBase = match[1];
						const rubyTextMatches = match[0].matchAll(/\{(\d+)\|(\d+)\|\d+\|([^}]+)\}/g);
						const rubyText: KaraokeAnimatedTextSegment[] = [];

						let rubyBaseStart = Infinity;
						let rubyBaseEnd = 0;

						for (const rubyTextMatch of rubyTextMatches) {
							const start = Number.parseInt(rubyTextMatch[1]);
							const end = Number.parseInt(rubyTextMatch[2]);
							const text = rubyTextMatch[3];
							rubyText.push({ text, start, end });

							rubyBaseStart = Math.min(rubyBaseStart, start);
							rubyBaseEnd = Math.max(rubyBaseEnd, end);
							lineStart = Math.min(lineStart, start);
							lineEnd = Math.max(lineEnd, end);
						}

						segments.push({
							rubyBase: {
								text: rubyBase,
								start: rubyBaseStart,
								end: rubyBaseEnd,
							},
							rubyText,
						});
					}
					else if (match[2]) {
						const parts = match[2].split("|");
						const start = Number.parseInt(parts[0]);
						const end = Number.parseInt(parts[1]);
						const text = parts[3];
						segments.push({ text, start, end });

						lineStart = Math.min(lineStart, start);
						lineEnd = Math.max(lineEnd, end);
					}
					else if (match[3]) {
						const text = match[3];
						segments.push({ text });
					}
				}

				return {
					segments,
					start: lineStart,
					end: lineEnd,
				};
			}),
		};
	});
}
