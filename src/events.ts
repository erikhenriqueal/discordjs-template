import fs from "fs";
import path from "path";

import ClientEvent from "./classes/ClientEvent";
import { ClientEvents } from "discord.js";

const eventsPath = path.join(__dirname, "/events");
if (!fs.existsSync(eventsPath) || !fs.statSync(eventsPath).isDirectory())
	throw new Error(`Events folder '${eventsPath}' not found`);

export default importEvents(eventsPath, true);

export function importEvents(
	eventsPath: string,
	recursive?: true
): ClientEvent<keyof ClientEvents>[] {
	const events: ClientEvent<keyof ClientEvents>[] = [];

	const eventsFiles = fs.readdirSync(eventsPath, { encoding: "utf-8" });
	for (const file of eventsFiles) {
		const eventPath = path.join(eventsPath, file);
		if (fs.statSync(eventPath).isDirectory() && recursive === true)
			events.push(...importEvents(eventPath));
		else if (fs.statSync(eventPath).isFile()) {
			try {
				const imported = require(eventPath);
				const event = "default" in imported ? imported.default : imported;
				if (!(event instanceof ClientEvent))
					throw new Error("Event is not a valid ClientEvent");

				events.push(event);
			} catch (e) {
				console.error(`Failed to import event from '${eventPath}'`);
				throw e;
			}
		}
	}

	return events;
}
