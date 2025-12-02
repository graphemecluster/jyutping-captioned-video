export default function parseLRC(input: string) {
	return input.slice(input.indexOf("[")).split(/\n(?=\[)/).map(line => {
		const splitIndex = line.indexOf("]");
		const [minutes, seconds] = line.slice(1, splitIndex).split(":");
		const [caption, translation] = line.slice(splitIndex + 1).split("\t");
		return {
			start: Number.parseInt(minutes) * 60 + Number.parseFloat(seconds),
			caption,
			translation,
		};
	});
}
