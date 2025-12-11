import type { KaraokeAnimatedLine, KaraokeParagraph } from "./types";
import type { Config } from ".";

export default function precomputeDisplayTime(paragraphs: KaraokeParagraph[], config: Config): KaraokeAnimatedLine[] {
	const {
		maxDisplayLines: nLines,
		animationDurationProportion: lineAnimDur,
		animationDurationProportionForInstrumentalSection: InstAnimDur,
		linePaddingDurationProportionForInstrumentalSection: padDur,
	} = config;
	// n.b. Number.MAX_VALUE is used instead of Infinity, otherwise both Remotion's built-in `interpolate` and `interpolateUnitBidirectional` in `utils.ts` won't work correctly
	return paragraphs.flatMap(({ lines }, i) =>
		lines.map(({ segments }, j) => ({
			segments,
			enterStart: j < nLines
				? (lines[0].start * (1 - padDur - InstAnimDur / 2) + (paragraphs[i - 1]?.lines.at(-1)!.end ?? -Number.MAX_VALUE) * (padDur + InstAnimDur / 2))
				: nLines > 1
				? (lines[j - nLines + 1].start * (1 + lineAnimDur) + lines[j - 1].end * (1 - lineAnimDur)) / 2
				: (lines[j - nLines + 1].start * (1 - lineAnimDur) + lines[j - 1].end * (1 + lineAnimDur)) / 2,
			enterEnd: j < nLines
				? (lines[0].start * (1 - padDur + InstAnimDur / 2) + (paragraphs[i - 1]?.lines.at(-1)!.end ?? -Number.MAX_VALUE) * (padDur - InstAnimDur / 2))
				: nLines > 1
				? (lines[j - nLines + 1].start * (1 - lineAnimDur) + lines[j - 1].end * (1 + lineAnimDur)) / 2
				: (lines[j - nLines + 1].start * (1 + lineAnimDur) + lines[j - 1].end * (1 - lineAnimDur)) / 2,
			exitStart: j >= lines.length - nLines
				? ((paragraphs[i + 1]?.lines[0].start ?? Number.MAX_VALUE) * (padDur - InstAnimDur / 2) + lines.at(-1)!.end * (1 - padDur + InstAnimDur / 2))
				: nLines > 1
				? (lines[j + 1].start * (1 + lineAnimDur) + lines[j + nLines - 1].end * (1 - lineAnimDur)) / 2
				: (lines[j + 1].start * (1 - lineAnimDur) + lines[j + nLines - 1].end * (1 + lineAnimDur)) / 2,
			exitEnd: j >= lines.length - nLines
				? ((paragraphs[i + 1]?.lines[0].start ?? Number.MAX_VALUE) * (padDur + InstAnimDur / 2) + lines.at(-1)!.end * (1 - padDur - InstAnimDur / 2))
				: nLines > 1
				? (lines[j + 1].start * (1 - lineAnimDur) + lines[j + nLines - 1].end * (1 + lineAnimDur)) / 2
				: (lines[j + 1].start * (1 + lineAnimDur) + lines[j + nLines - 1].end * (1 - lineAnimDur)) / 2,
			displayLineIndex: j % nLines,
		}))
	);
}
