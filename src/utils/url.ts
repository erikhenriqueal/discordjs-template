// Regular expression used to validate and extract parts of a URL-like string.
export const URL_REGEXP =
	/^(http[s]?:\/\/)?([a-zA-Z\d-]+(?:\.[a-zA-Z\d-]+)+)(:\d{1,5})?((?:\/[\w.-]*)*)?(\?\S*)?$/i;

/**
 * Parse a URL-like string and return its parts or `null` when invalid.
 * The returned object contains a convenient `toString()` method to reconstruct the URL.
 */
export function parseURL(url: string): {
	method: "http" | "https" | null;
	domain: string;
	port: number | null;
	path: string;
	params: { [key: string]: string } | null;
} | null {
	if (typeof url !== "string" || !URL_REGEXP.test(url)) return null;
	const matcher = url.match(URL_REGEXP) as RegExpMatchArray;
	const method = matcher[1]
		? (matcher[1].slice(0, -3) as "http" | "https")
		: null;
	const domain = matcher[2];
	const port = matcher[3] ? Number(matcher[3].slice(1)) : null;
	const path = matcher[4] || "/";
	const params = matcher[5]
		? Object.fromEntries(
				matcher[5]
					.slice(1)
					.split("&")
					.map((p) => {
						const [k, ...v] = p.split("=");
						return [k, v.join("=")];
					})
		  )
		: null;

	const parsed = {
		method,
		domain,
		port,
		path,
		params,
	};

	parsed.toString = function () {
		const args = [
			this.method ? `${this.method}://` : "",
			this.domain,
			this.port ? `:${this.port}` : "",
			this.path,
			this.params
				? `?${Object.entries(this.params)
						.map(([k, v]) => `${k}=${v}`)
						.join("&")}`
				: "",
		];
		return args.join("");
	};

	return parsed;
}

/**
 * Remove protocol prefix (`http://` or `https://`) and trim the URL.
 */
export function clearURL(url: string): string {
	if (url.startsWith("http://")) url = url.slice(7);
	if (url.startsWith("https://")) url = url.slice(8);

	return url.trim();
}

/**
 * Compare two URLs for equality ignoring protocol differences (http/https).
 */
export function matchURLs(urlA: string, urlB: string): boolean {
	if (!URL_REGEXP.test(urlA) || !URL_REGEXP.test(urlB)) return false;

	const cleanA = clearURL(urlA);
	const cleanB = clearURL(urlB);

	return cleanA === cleanB;
}
