import "./utils/loadEnv";

console.log("Bot iniciado."); // Necessary for some hosting services such as HaskHosting
if (process.env["DEV_ONLY"] === "true") console.log("Dev Only Mode Activated");

import { getClientConfig } from "./utils/clientConfig";

import { Client } from "discord.js";
const client = new Client({ intents: getClientConfig("intents") });

import { handleEvents } from "./handlers/eventsHandler";

handleEvents(client);

client.login(process.env["BOT_TOKEN"]);
