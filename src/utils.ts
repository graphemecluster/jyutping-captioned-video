import type { EnterExitTransitionTimes } from "./TiuMouGaai/types";

export function parseSexagesimalNumber(numberString: string) {
	let multiplier = 1;
	switch (numberString[0]) {
		case "-":
			multiplier = -1;
		// fallthrough
		case "+":
			numberString = numberString.slice(1);
	}
	let value = 0;
	for (const part of numberString.split(":")) {
		value = value * 60 + Number.parseFloat(part);
	}
	return value * multiplier;
}

// Fast interpolate to the range 0~1, then 1~0. Prevent "monotonically increasing" error by Remotion's built-in `interpolate`
export function interpolateUnitBidirectional(currValue: number, transitionTimes: EnterExitTransitionTimes) {
	const { enterStart, enterEnd, exitStart, exitEnd } = transitionTimes;
	return Math.max(0, Math.min(1, (currValue - enterStart) / (enterEnd - enterStart), (currValue - exitEnd) / (exitStart - exitEnd)));
}
