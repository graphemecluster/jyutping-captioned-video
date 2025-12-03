// Time unit: ticks (raw values from data file)

import type { KaraokeAnimatedRuby, KaraokeAnimatedTextSegment, KaraokeAnimatedTextToken, KaraokeParagraph, KaraokePlainTextToken } from "./types";

export default function parseKaraoke(input: string): KaraokeParagraph[] {
	const paragraphs = input.trim().split(/(?:(?:\r\n|\r(?!\n)|\n|\u2028){2}|\u2029)[\r\n\u2028\u2029]*/);

	return paragraphs.map(paragraph => {
		const lines = paragraph.trim().split(/\r\n|\r(?!\n)|\n|\u2028/);

		return {
			lines: lines.map(line => {
				const segments: (KaraokePlainTextToken | KaraokeAnimatedTextSegment | KaraokeAnimatedRuby)[] = [];
				let lineStart = Infinity;
				let lineEnd = 0;

				// Parse pattern: [rubyBase{start|end|note|rubyText1}{start|end|note|rubyText2}] or {start|end|note|text} or plain text
				const matches = Array.from(line.matchAll(/\[([^[\]{}]+)(?:\{[^{}]+\})+\]|\{([^{}]+)\}|([^[\]{}]+)/g));

				for (let i = 0; i < matches.length; i++) {
					const match = matches[i];

					if (match[1]) {
						// Ruby pattern: [rubyBase{...}{...}]
						const rubyBase = match[1];
						const rubyTextMatches = match[0].matchAll(/\{([^{}]+)\}/g);
						const tokens: KaraokeAnimatedTextToken[] = [];

						let rubyBaseStart = Infinity;
						let rubyBaseEnd = 0;

						for (const rubyTextMatch of rubyTextMatches) {
							const parts = rubyTextMatch[1].split("|");
							const start = Number.parseFloat(parts[0]);
							const end = Number.parseFloat(parts[1]);
							const note = parts[3] === undefined ? undefined : Number.parseInt(parts[2]);
							const text = parts[3] === undefined ? parts[2] : parts[3];
							tokens.push({ note, text, start, end });

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
							rubyText: { tokens },
						});
					}
					else if (match[2]) {
						// Animated token pattern: {start|end|note|text}
						// Check if consecutive tokens should be grouped into a segment
						const tokens: KaraokeAnimatedTextToken[] = [];

						for (let j = i; j < matches.length && matches[j][2]; j++) {
							const parts = matches[j][2].split("|");
							const start = Number.parseFloat(parts[0]);
							const end = Number.parseFloat(parts[1]);
							const note = parts[3] === undefined ? undefined : Number.parseInt(parts[2]);
							const text = parts[3] === undefined ? parts[2] : parts[3];
							tokens.push({ note, text, start, end });

							lineStart = Math.min(lineStart, start);
							lineEnd = Math.max(lineEnd, end);

							i = j; // Update outer loop index
						}

						segments.push({ tokens });
					}
					else if (match[3]) {
						// Plain text
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
