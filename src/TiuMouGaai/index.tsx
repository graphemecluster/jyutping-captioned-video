import { Fragment } from "react/jsx-runtime";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

import KaraokeAnimatedSegment from "./KaraokeAnimatedSegment";
import parseKaraoke from "./parseKaraoke";
import precomputeDisplayTime from "./precomputeDisplayTime";
import subtitles from "./subtitles.txt";
import { interpolateUnitBidirectional } from "../utils";

import type { KaraokeAnimatedLine } from "./types";

const config = {
	title: "跳舞街",
	ticksPerSecond: 136.62 * 8 / 5,

	maxDisplayLines: 4,

	// How long the lines are continually displayed after the end of a paragraph / displayed in advance of the start of a paragraph
	// Must be between (animationDurationProportionForInstrumentalSection / 2) ~ (1 - animationDurationProportionForInstrumentalSection / 2)
	linePaddingDurationProportionForInstrumentalSection: 1 / 3,

	// Relative animation time for transition between two lines. 0 disables animation.
	// Must be between 0 ~ 1.
	animationDurationProportion: 1 / 15,
	animationDurationProportionForInstrumentalSection: 1 / 30, // Animation centered around linePaddingDurationProportionForInstrumentalSection
};

// Temporary solution. Types shouldn't have been defined here
// TODO use Zod and Remotion default parameter feature
export type Config = typeof config;

const parsedData = parseKaraoke(subtitles);
const precomputedLines = precomputeDisplayTime(parsedData, config);

export default function TiuMouGaai() {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const currTicks = (frame / fps) * config.ticksPerSecond;

	const displayLines = precomputedLines.filter(({ enterStart, exitEnd }) => currTicks >= enterStart && currTicks < exitEnd);
	const actualDisplayLineCount = new Set(displayLines.map(({ displayLineIndex }) => displayLineIndex)).size;

	function renderLine(line: KaraokeAnimatedLine, lineIndex: number) {
		return <div
			key={lineIndex}
			className="relative w-0"
			style={{
				gridRowStart: line.displayLineIndex + 1,
				gridColumnStart: line.displayLineIndex + 1,
			}}>
			&nbsp;
			<div
				className="absolute bottom-0 whitespace-nowrap"
				style={{
					left: `${(actualDisplayLineCount > 1 ? line.displayLineIndex / (actualDisplayLineCount - 1) : 0.5) * 100}%`,
					translate: `-${(actualDisplayLineCount > 1 ? line.displayLineIndex / (actualDisplayLineCount - 1) : 0.5) * 100}%`,
					opacity: interpolateUnitBidirectional(currTicks, line),
				}}>
				{line.segments.map((segment, segmentIndex) =>
					"rubyBase" in segment
						? <ruby className="text-[0.8em]" key={segmentIndex}>
							<KaraokeAnimatedSegment segment={{ tokens: [segment.rubyBase] }} currTicks={currTicks} />
							<rt className="relative top-32">
								<KaraokeAnimatedSegment segment={segment.rubyText} currTicks={currTicks} />
							</rt>
						</ruby>
						: "tokens" in segment
						? <KaraokeAnimatedSegment key={segmentIndex} segment={segment} currTicks={currTicks} />
						: <Fragment key={segmentIndex}>{segment.text}</Fragment>
				)}
			</div>
		</div>;
	}

	return (
		<AbsoluteFill
			lang="zh-HK"
			className={`grid items-baseline content-end ${actualDisplayLineCount > 1 ? "justify-between" : "justify-around"} pb-20 px-20 bg-black text-[160px] font-vf-sung leading-[1.1] text-white select-none`}>
			{displayLines.map(renderLine)}
		</AbsoluteFill>
	);
}
