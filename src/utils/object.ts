/**
 * Returns true if every value in `data` passes the `checker` predicate.
 */
export function trustAll<T>(
	checker: (data: T) => boolean,
	...data: T[]
): boolean {
	return !data.some((d) => !checker(d));
}

/**
 * Merge `origin` with additional `data` elements.
 * - If origin is an array and all data are arrays, concatenates them.
 * - If origin is a plain object and all data are plain objects, shallow-merges them.
 * - Otherwise returns the original value or `null` when origin is falsy.
 */
export function merge<T>(origin: T, ...data: T[]) {
	const original = origin;
	if (!origin || data.some((d) => !d)) return origin ?? null;
	if (Array.isArray(origin) && trustAll((d) => Array.isArray(d), ...data)) {
		return origin.concat(...data);
	} else if (
		isPrimitiveObject(origin) &&
		trustAll((d) => isPrimitiveObject(d), ...data)
	) {
		return Object.assign({}, origin, ...data);
	} else {
		return original;
	}
}

/**
 * Checks whether `val` is a plain/primitive object (i.e. created with `{}` or `new Object`).
 */
export function isPrimitiveObject(val: any) {
	if (!val) return false;
	return Object.getPrototypeOf(val) === Object.prototype;
}
