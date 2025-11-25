import { randomint } from "./number";
import { compareLetters, treat } from "./string";
// import { getRelevanceScore } from "./string";

export function uniques<T>(array: T[]): T[] {
	const uniqueValues: T[] = [];
	return array.filter((v) => {
		if (!uniqueValues.includes(v)) {
			uniqueValues.push(v);
			return true;
		}
		return false;
	});
}

export function shuffle<T>(array: T[]): T[] {
	const arrayCopy = array.slice();
	const shuffled = [];
	for (let i = 0; i < array.length; i++) {
		const index = randomint(0, arrayCopy.length - 1);
		shuffled.push(arrayCopy.splice(index, 1)[0]);
	}
	return shuffled;
}

/**
 * Sorts `items` by accuracy with `query`
 * @param query Query to sort `items`
 * @param items List to be sorted
 * @param selector If `items` is not a `string` Array, selector is a way to define which value for `items` you want to sort. Default behavior, if `selector` is missing, is to convert each value in `items` using `String(item)`.
 * @returns Sorted `items` list
 */
export function querySort<T>(
	query: string,
	items: T[],
	selector?: (item: T) => string
): [number, T][] {
	const _selector = (v: T) =>
		treat(`${typeof selector === "function" ? selector(v) : v}`);
	return items
		.map((i) => [compareLetters(treat(query), _selector(i)), i] as [number, T])
		.sort((a, b) => b[0] - a[0]);
}
