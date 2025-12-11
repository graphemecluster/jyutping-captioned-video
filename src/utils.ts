import type { EnterExitTransitionTimes } from "./TiuMouGaai/types";

// Fast interpolate to the range 0~1, then 1~0. Prevent "monotonically increasing" error by Remotion's built-in `interpolate`
export function interpolateUnitBidirectional(currValue: number, transitionTimes: EnterExitTransitionTimes) {
	const { enterStart, enterEnd, exitStart, exitEnd } = transitionTimes;
	return Math.min(1, (currValue - enterStart) / (enterEnd - enterStart), (currValue - exitEnd) / (exitStart - exitEnd));
}
