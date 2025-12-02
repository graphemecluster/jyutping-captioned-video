import { Fragment } from "react/jsx-runtime";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

import KaraokeAnimatedSegment from "./KaraokeAnimatedSegment";
import parseKaraoke from "./parseKaraoke";
import precomputeDisplayTime from "./precomputeDisplayTime";
import subtitles from "./subtitles.txt";

import type { KaraokeLine } from "./types";

// SPT (seconds per tick): 143 is the BPM
const SPT = 1 / 8 / 143;

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
					? <ruby key={segmentIndex}>
						<KaraokeAnimatedSegment segment={segment.rubyBase} currTicks={currTicks} />
						<rt className="relative top-20">
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
		<AbsoluteFill lang="ja" className="bg-black text-white select-none">
			<div className="absolute bottom-20 inset-x-20 text-[100px] font-serif leading-none whitespace-nowrap">
				{displayLines.map(renderLine)}
			</div>
		</AbsoluteFill>
	);
}
