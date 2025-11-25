/**
 * Returns a random floating number between `a` and `b` (inclusive lower, exclusive upper).
 */
export function random(a: number, b: number): number {
	const x = Math.max(a, b);
	const y = Math.min(a, b);
	return Math.random() * (x - y) + y;
}

/**
 * Returns a random integer between `a` and `b` (inclusive).
 */
export function randomint(a: number, b: number): number {
	const x = Math.floor(Math.max(a, b));
	const y = Math.floor(Math.min(a, b));
	return Math.floor(Math.random() * (x - y + 1) + y);
}
