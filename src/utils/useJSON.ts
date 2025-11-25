import { readFileSync, writeFileSync } from "fs";
import { merge } from "./object";

/**
 * Read and parse a JSON file then pass the parsed value to `callback`.
 * Any JSON parse error is logged and `null` is provided to the callback.
 */
export function resolveJSON<T>(
	path: string,
	callback: (data: T | null) => any
) {
	const raw = readFileSync(path, { encoding: "utf8" });
	let resolved = null;
	try {
		resolved = JSON.parse(raw);
	} catch (e) {
		console.error(`[ Utils - useJSON ] Failed to parse Json:`, e);
	}

	return callback(resolved);
}

/**
 * Merge `newData` into the JSON file at `path` and write back the result.
 * Returns `true` on success or `false` on failure.
 */
export function updateJSON<T>(path: string, newData: any): boolean {
	return resolveJSON<T>(path, (data) => {
		if (!data) return false;
		if (
			Object.getPrototypeOf(data) !== Object.prototype ||
			typeof data !== typeof newData
		) {
			console.error(
				[
					"Data type doesn't match",
					`- Data: ${typeof data} | ${Object.getPrototypeOf(data)}`,
					`- New Data: ${typeof newData} | ${Object.getPrototypeOf(newData)}`,
				]
					.map((s) => `[ Utils - useJSON - updateJSON ] ${s}`)
					.join("\n")
			);
			return false;
		}

		const updatedData = merge(data, newData);

		try {
			writeFileSync(path, JSON.stringify(updatedData, null, 2), {
				encoding: "utf-8",
			});
			return true;
		} catch (e) {
			return false;
		}
	});
}
