import { Awaitable, ClientEvents } from "discord.js";

/**
 * Simple wrapper that represents a client event with a listener and optional `once` flag.
 * The `log` helper prefixes messages for consistent event-related logs.
 */
export default class ClientEvent<Event extends keyof ClientEvents> {
	name: Event;
	once: boolean;

	get listener() {
		return this._listener;
	}
	setListener(
		listener: (...args: ClientEvents[Event]) => Awaitable<any>
	): this {
		this._listener = listener;
		return this;
	}

	private _listener: (...args: any[]) => any = () => void 0;

	constructor(name: Event, once: boolean = false) {
		this.name = name;
		this.once = once;
	}

	/**
	 * Log helper that prefixes each line with a consistent event tag.
	 */
	log(...args: any[]) {
		const prefix = `[ ClientEvent - ${String(this.name)} ]`;
		const content = args
			.map((value) => {
				if (typeof value == "string")
					return [
						value
							.split("\n")
							.map((line) => `${prefix} ${line}`)
							.join("\n"),
					];
				return [prefix, value];
			})
			.flat(1);

		for (const value of content) console.log(value);
	}
}
