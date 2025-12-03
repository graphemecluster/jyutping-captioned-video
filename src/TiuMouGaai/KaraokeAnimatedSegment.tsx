import { useId, useLayoutEffect, useRef, useState } from "react";

import type { KaraokeAnimatedTextSegment } from "./types";

interface KaraokeAnimatedSegmentProps {
	segment: KaraokeAnimatedTextSegment;
	currTicks: number;
}

interface TokenRect {
	left: number;
	right: number;
}

export default function KaraokeAnimatedSegment({ segment, currTicks }: KaraokeAnimatedSegmentProps) {
	const { tokens } = segment;
	const spanRef = useRef<HTMLSpanElement>(null);
	const [tokenRects, setTokenRects] = useState<TokenRect[]>([]);

	const fullText = tokens.map(({ text }) => text).join("");

	useLayoutEffect(() => {
		const span = spanRef.current;
		const textNode = span?.firstChild;
		if (!textNode) return;

		const rects: TokenRect[] = [];
		let cumulativeOffset = 0;
		let firstRectLeft: number | undefined;

		for (const token of tokens) {
			const range = new Range();
			range.setStart(textNode, cumulativeOffset);
			range.setEnd(textNode, cumulativeOffset += token.text.length);

			const rect = range.getBoundingClientRect();
			firstRectLeft ??= rect.left;
			rects.push({
				left: rect.left - firstRectLeft,
				right: rect.right - firstRectLeft,
			});
		}

		setTokenRects(rects);
	}, [tokens]);

	// Calculate gradient stops based on token progress
	const gradientStops: { offset: number; isSung: boolean }[] = [{ offset: 0, isSung: false }];

	if (tokenRects.length === tokens.length) {
		const totalWidth = tokenRects[tokenRects.length - 1].right;
		let prevProgressPercent = 0;

		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i];
			const rect = tokenRects[i];
			const duration = token.end - token.start;
			const elapsed = currTicks - token.start;
			const progress = duration > 0 ? Math.max(0, Math.min(1, elapsed / duration)) : 0;

			const startPercent = rect.left / totalWidth;
			const endPercent = rect.right / totalWidth;
			const progressPercent = startPercent + (endPercent - startPercent) * progress;

			// If there's a previous stop, revert color back from white to cyan at startPercent (if the percentage is the same as the previously pushed progressPrecent, cancels each other out)
			if (gradientStops.length > 1) {
				if (startPercent === prevProgressPercent) {
					gradientStops.pop();
					gradientStops.pop();
				}
				else if (progressPercent !== startPercent) {
					gradientStops.push({ offset: startPercent, isSung: true });
					gradientStops.push({ offset: startPercent, isSung: false });
				}
			}
			// Add the progress stop (if the percentage is the same as startPercent, cancels each other out)
			if (gradientStops.length <= 1 || progressPercent !== startPercent) {
				gradientStops.push({ offset: progressPercent, isSung: false });
				gradientStops.push({ offset: progressPercent, isSung: true });
				prevProgressPercent = progressPercent;
			}
		}

		gradientStops.push({ offset: 1, isSung: true });
	}

	const gradientId = useId();
	const outlineGradientId = useId();

	return (
		<span className="inline-block relative">
			<span ref={spanRef} className="text-transparent" aria-hidden>{fullText}</span>
			<span className="absolute inset-0">
				<svg width="0" height="0">
					<defs>
						<linearGradient id={gradientId}>
							{gradientStops.map((stop, i) => (
								<stop key={i} offset={`${stop.offset * 100}%`} stopColor={stop.isSung ? "white" : "#21dffa"} />
							))}
						</linearGradient>
						<linearGradient id={outlineGradientId}>
							{gradientStops.map((stop, i) => (
								<stop key={i} offset={`${stop.offset * 100}%`} stopColor={stop.isSung ? "#fa2121" : "white"} />
							))}
						</linearGradient>
					</defs>
				</svg>
				<svg className="overflow-visible">
					<text
						x="0"
						y="1em"
						fill={`url(#${gradientId})`}
						stroke={`url(#${outlineGradientId})`}
						strokeWidth="10"
						paintOrder="stroke">
						{fullText}
					</text>
				</svg>
			</span>
		</span>
	);
}
