import type { KaraokeAnimatedTextSegment } from "./types";

interface KaraokeAnimatedSegmentProps {
	segment: KaraokeAnimatedTextSegment;
	currTicks: number;
}

export default function KaraokeAnimatedSegment({ segment, currTicks }: KaraokeAnimatedSegmentProps) {
	const { text, start, end } = segment;
	const duration = end - start;
	const elapsed = currTicks - start;

	// Calculate gradient position (0% = not started, 100% = complete)
	const progress = duration > 0 ? Math.max(0, Math.min(100, (elapsed / duration) * 100)) : 0;

	const gradientId = `gradient-${start}-${end}`;
	const outlineGradientId = `outline-gradient-${start}-${end}`;

	return (
		<span className="inline-block relative">
			<span className="text-transparent" aria-hidden>{text}</span>
			<span className="absolute inset-0">
				<svg width="0" height="0">
					<defs>
						<linearGradient id={gradientId}>
							<stop offset="0%" stopColor="#21dffa" />
							<stop offset={`${progress}%`} stopColor="#21dffa" />
							<stop offset={`${progress}%`} stopColor="white" />
							<stop offset="100%" stopColor="white" />
						</linearGradient>
						<linearGradient id={outlineGradientId}>
							<stop offset="0%" stopColor="white" />
							<stop offset={`${progress}%`} stopColor="white" />
							<stop offset={`${progress}%`} stopColor="#fa2121" />
							<stop offset="100%" stopColor="#fa2121" />
						</linearGradient>
					</defs>
				</svg>
				<svg className="overflow-visible">
					<text
						x="0"
						y="1em"
						fill={`url(#${outlineGradientId})`}
						stroke={`url(#${outlineGradientId})`}
						strokeWidth="10"
						paintOrder="stroke">
						{text}
					</text>
					<text
						x="0"
						y="1em"
						fill={`url(#${gradientId})`}>
						{text}
					</text>
				</svg>
			</span>
		</span>
	);
}
