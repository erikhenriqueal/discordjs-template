import { GatewayIntentsString } from "discord.js";
import { resolve } from "path";
import Config from "./useConfig";

export interface BaseClientConfigData {
	intents: GatewayIntentsString[];
	message_commands_prefix?: string;
	activities: [];
	rotate_activities?: boolean;
	rotate_activities_interval?: number;
}

export type ClientConfigData<T = { [key: string]: any }> =
	BaseClientConfigData & T;

const clientConfig = new Config<ClientConfigData>(
	resolve(process.cwd(), "clientConfig.json"),
	{ watch: true }
);
export default clientConfig;

export function getClientConfig<T>(key: string): T {
	if (
		key === "message_commands_prefix" &&
		process.env["DEV_ONLY"] === "true" &&
		process.env["DEV_ONLY_PREFIX"]?.length != 0
	) {
		return process.env["DEV_ONLY_PREFIX"] as T;
	}
	return clientConfig.get(key);
}

export function updateClientConfig(
	newData: ClientConfigData<{ [key: string]: any }>
): boolean {
	return clientConfig.update(newData);
}
