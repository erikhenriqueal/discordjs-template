import { remove as removeAccents } from "remove-accents";

/**
 * Treat the `string` by trimming, lowercasing and removing accents
 * @param string String to treat
 */
export function treat(string: string): string {
	return removeAccents(string.toLowerCase().trim());
}

/**
 * Transforms `string` from `CamelCase` into `snake_case`.
 * @param string `CamelCased` string.
 * @returns eg. `ThisIsAVariable` -> `this_is_a_variable`
 */
export function toSnakeCase(string: string): string {
	return string
		.trim()
		.split("")
		.map((c, i) => {
			c = c.trim();
			if (c.toLowerCase() != c) return `${i > 0 ? "_" : ""}${c.toLowerCase()}`;
			return c;
		})
		.join("");
}

/**
 * - - - - - - - - -
 *      SORTER
 * - - - - - - - - -
 */

//
// SORTER HELPERS
//

function countMatchingChars(ref: string, comp: string): number {
	const compSet = new Set(comp);
	return [...ref].filter((char) => compSet.has(char)).length;
}

function longestSequenceMatch(ref: string, comp: string): number {
	let max = 0;
	for (let i = 0; i < ref.length; i++) {
		for (let j = 0; j < comp.length; j++) {
			let k = 0;
			while (
				i + k < ref.length &&
				j + k < comp.length &&
				ref[i + k] === comp[j + k]
			) {
				k++;
			}
			max = Math.max(max, k);
		}
	}
	return max;
}

function positionBonus(ref: string, comp: string): number {
	const index = ref.indexOf(comp[0]);
	if (index === -1) return 0;
	return 1 - index / ref.length; // earlier is better
}

//
// SORTER COMPARATOR
//

/**
 * Compares the letters between `ref` and `comp`
 * @param ref Reference main string
 * @param comp String to compare to `ref`
 * @returns How much `stringA`'s letters includes `stringB`'s letters
 */
export function compareLetters(ref: string, comp: string): number {
	const wExact = 5;
	const wPrefix = 3;
	const wSeq = 2;
	const wChars = 1.5;
	const wPosition = 1;

	const exactMatch = ref === comp ? 1 : 0;
	const prefixMatch = ref.startsWith(comp) ? 1 : 0;
	const sequenceScore = longestSequenceMatch(ref, comp) / comp.length;
	const charMatchScore = countMatchingChars(ref, comp) / comp.length;
	const positionWeight = positionBonus(ref, comp);

	const weightedScore =
		wExact * exactMatch +
		wPrefix * prefixMatch +
		wSeq * sequenceScore +
		wChars * charMatchScore +
		wPosition * positionWeight;

	const maxScore = wExact + wPrefix + wSeq + wChars + wPosition;

	if (
		exactMatch === 0 &&
		prefixMatch === 0 &&
		sequenceScore === 0 &&
		charMatchScore === 0
	) {
		return 0;
	}

	return weightedScore / maxScore;
}
