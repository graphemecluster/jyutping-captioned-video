export default function binarySearch(currSeconds: number, startSeconds: number[]) {
	let left = 0;
	let right = startSeconds.length - 1;
	let result = -1;

	while (left <= right) {
		const mid = Math.floor((left + right) / 2);
		if (startSeconds[mid] <= currSeconds) {
			result = mid;
			left = mid + 1;
		}
		else {
			right = mid - 1;
		}
	}

	return result;
}
