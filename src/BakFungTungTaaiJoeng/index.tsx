import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

import parseLRC from "./parseLRC";
import subtitles from "./subtitles.lrc";
import binarySearch from "./binarySearch";
import ColouredCaptionRenderer from "./ColouredCaptionRenderer";

const parsedSubtitles = parseLRC(subtitles);
const startSeconds = parsedSubtitles.map(({ start }) => start);

const crossfadeDuration = 0.4 /* seconds */;

export default function BakFungTungTaaiJoeng() {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const currSeconds = frame / fps;

	const currLineIndex = binarySearch(currSeconds, startSeconds);
	const currLine = currLineIndex === -1 ? undefined : parsedSubtitles[currLineIndex];
	const currLineStartSeconds = currLine?.start;

	const opacity = currLineStartSeconds === undefined ? 0 : Math.min(1, (currSeconds - currLineStartSeconds) / crossfadeDuration);

	return <AbsoluteFill lang="zh-HK">
		<AbsoluteFill className="px-6 py-12 flex flex-col items-stretch justify-between font-vf-sung text-center leading-none" style={{ opacity }}>
			<div className="text-[160px]">
				<ColouredCaptionRenderer>{currLine?.caption}</ColouredCaptionRenderer>
			</div>
			<div className="text-[96px]">{currLine?.translation}</div>
		</AbsoluteFill>
	</AbsoluteFill>;
}
