import "./utils/loadEnv";

console.log("Bot iniciado."); // Necessary for some hosting services such as HaskHosting
if (process.env["DEV_ONLY"] === "true") console.log("Dev Only Mode Activated");

import { Client, GatewayIntentsString } from "discord.js";
import { PrivilegedIntents } from "./utils/discord";
import { getClientConfig } from "./utils/clientConfig";
import { handleEvents } from "./handlers/eventsHandler";

const clientIntents: GatewayIntentsString[] = getClientConfig("intents") ?? [];

if (clientIntents.some((i) => PrivilegedIntents.includes(i)))
	console.warn(
		`Using privileged intents (${clientIntents
			.filter((i) => PrivilegedIntents.includes(i))
			.join(", ")}) may require enabling them in the Discord Developer Portal.`
	);

const client = new Client({ intents: clientIntents });

handleEvents(client);

client.login(process.env["BOT_TOKEN"]);
