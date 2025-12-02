import { Fragment } from "react/jsx-runtime";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

import KaraokeAnimatedSegment from "./KaraokeAnimatedSegment";
import parseKaraoke from "./parseKaraoke";
import precomputeDisplayTime from "./precomputeDisplayTime";
import subtitles from "./subtitles.txt";

import type { KaraokeLine } from "./types";

// SPT (seconds per tick): 136.62 is the BPM
const SPT = 5 / 8 / 136.62;

const parsedData = parseKaraoke(subtitles);
const precomputedLines = precomputeDisplayTime(parsedData);

export default function TiuMouGaai() {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const currTicks = (frame / fps) / SPT;

	const displayLines = precomputedLines.filter(({ start, end }) => currTicks >= start && currTicks < end);
	const displayLineCount = displayLines.length;
	displayLines.sort((a, b) => a.index % displayLineCount - b.index % displayLineCount);

	function renderLine(line: KaraokeLine, index: number) {
		return <div key={index} className="text-left even:text-right">
			{line.segments.map((segment, segmentIndex) =>
				"rubyBase" in segment
					? <ruby className="text-[0.8em]" key={segmentIndex}>
						<KaraokeAnimatedSegment segment={segment.rubyBase} currTicks={currTicks} />
						<rt className="relative top-32">
							{segment.rubyText.map((rubySegment, rubySegmentIndex) => (
								<KaraokeAnimatedSegment key={rubySegmentIndex} segment={rubySegment} currTicks={currTicks} />
							))}
						</rt>
					</ruby>
					: "start" in segment
					? <KaraokeAnimatedSegment key={segmentIndex} segment={segment} currTicks={currTicks} />
					: <Fragment key={segmentIndex}>{segment.text}</Fragment>
			)}
		</div>;
	}

	return (
		<AbsoluteFill lang="zh-HK" className="bg-black text-white select-none">
			<div className="absolute bottom-20 inset-x-20 text-[160px] font-vf-sung leading-[1.1] whitespace-nowrap">
				{displayLines.map(renderLine)}
			</div>
		</AbsoluteFill>
	);
}
