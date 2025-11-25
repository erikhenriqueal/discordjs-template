/**
 * Reduces milliseconds into [`hours`, `minutes`, `seconds` and `milliseconds`].
 */
export function reduce(ms: number): [number, number, number, number] {
	return [
		Math.floor(ms / 1000 / 60 / 60), // Hours
		Math.floor(ms / 1000 / 60) % 60, // Minutes
		Math.floor(ms / 1000) % 60, // Seconds
		ms % 1000, // Milliseconds rest
	];
}

export function toString(ms: number): string {
	if (isNaN(ms)) return "--:--";
	const [h, m, s] = reduce(ms);

	const timeString = [
		h.toLocaleString(undefined, { minimumIntegerDigits: 2 }),
		m.toLocaleString(undefined, { minimumIntegerDigits: 2 }),
		s.toLocaleString(undefined, { minimumIntegerDigits: 2 }),
	];

	if (h > 0) return timeString.join(":");
	else return timeString.slice(1).join(":");
}

export function toFullString(ms: number, extended?: boolean): string {
	if (isNaN(ms)) return "--";
	const [h, m, s] = reduce(ms);

	const timeString = [
		h > 0 ? `${h.toLocaleString("br")}${extended ? " hours" : "h"}` : null,
		m > 0 ? `${m.toLocaleString("br")}${extended ? " minutes" : "min"}` : null,
		`${h > 0 || m > 0 ? "and " : ""}${s.toLocaleString("br")}${
			extended ? " seconds" : "s"
		}`,
	].filter((t) => t !== null);

	return timeString.join(" ").trim();
}
