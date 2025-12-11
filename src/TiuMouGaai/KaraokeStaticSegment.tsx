import type { KaraokePlainTextToken } from "./types";

interface KaraokeStaticSegmentProps {
	token: KaraokePlainTextToken;
}

export default function KaraokeStaticSegment({ token }: KaraokeStaticSegmentProps) {
	const { text } = token;

	return (
		<span className="inline-block relative">
			<span className="text-transparent whitespace-pre" aria-hidden>{text}</span>
			<span className="absolute inset-0">
				<svg className="overflow-visible">
					<text
						x="0"
						y="1em"
						fill="white"
						stroke="dimgrey"
						strokeWidth="10"
						paintOrder="stroke">
						{text}
					</text>
				</svg>
			</span>
		</span>
	);
}
