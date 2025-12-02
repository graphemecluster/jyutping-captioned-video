import posToColour from "./posToColour";

export default function ColouredCaptionRenderer({ children: caption }: { children: string | undefined }) {
	return caption?.split(" ").map((segment, i) => {
		const [pos, text] = segment.split("|");
		const color = posToColour[pos];
		return <span key={i} style={color ? { color } : undefined}>{text}</span>;
	});
}
