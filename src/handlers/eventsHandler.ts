import { Client } from "discord.js";

import events from "../events";

/**
 * Register all events found under the `events` collection onto the provided client.
 * Events marked with `once` are attached via `client.once`, otherwise `client.on` is used.
 */
export function handleEvents(client: Client) {
	for (const event of events) {
		if (event.once) client.once(event.name, event.listener);
		else client.on(event.name, event.listener);
	}
}
