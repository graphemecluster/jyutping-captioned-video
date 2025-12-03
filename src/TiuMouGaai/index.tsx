import { Fragment } from "react/jsx-runtime";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

import KaraokeAnimatedSegment from "./KaraokeAnimatedSegment";
import parseKaraoke from "./parseKaraoke";
import precomputeDisplayTime from "./precomputeDisplayTime";
import subtitles from "./subtitles.txt";

import type { KaraokeLine } from "./types";

const config = {
	title: "跳舞街",
	ticksPerSecond: 136.62 * 8 / 5,

	maxDisplayLines: 4,
};

const parsedData = parseKaraoke(subtitles);
const precomputedLines = precomputeDisplayTime(parsedData, config.maxDisplayLines);

export default function TiuMouGaai() {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const currTicks = (frame / fps) * config.ticksPerSecond;

	const displayLines = precomputedLines.filter(({ start, end }) => currTicks >= start && currTicks < end);
	const actualDisplayLineCount = displayLines.length;
	displayLines.sort((a, b) => a.displayLineIndex - b.displayLineIndex);

	function renderLine(line: KaraokeLine, lineIndex: number) {
		return <div key={lineIndex} className={`flex items-baseline ${actualDisplayLineCount > 1 ? "justify-between" : "justify-around"}`}>
			{displayLines.map((...[, i]) => (
				<div key={i} className="relative w-0">
					&nbsp;
					{i === lineIndex
						&& <div
							className="absolute bottom-0 whitespace-nowrap"
							style={{
								left: `${(actualDisplayLineCount > 1 ? lineIndex / (actualDisplayLineCount - 1) : 0.5) * 100}%`,
								translate: `-${(actualDisplayLineCount > 1 ? lineIndex / (actualDisplayLineCount - 1) : 0.5) * 100}%`,
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
						</div>}
				</div>
			))}
		</div>;
	}

	return (
		<AbsoluteFill lang="zh-HK" className="flex flex-col items-stretch justify-end pb-20 px-20 bg-black text-[160px] font-vf-sung leading-[1.1] text-white select-none">
			{displayLines.map(renderLine)}
		</AbsoluteFill>
	);
}
