import { resolve } from "path";
import Config from "./useConfig";

export interface BaseGuildConfigData {}

export type GuildConfigData<T = { [key: string]: any }> = BaseGuildConfigData &
	T;

const guildConfig = new Config<GuildConfigData>(
	resolve(process.cwd(), "guildConfig.json"),
	{ watch: true }
);

export function getGuildConfig<T>(key: string): T {
	return guildConfig.get(key);
}

export function updateGuildConfig(
	newData: GuildConfigData<{ [key: string]: any }>
): boolean {
	return guildConfig.update(newData);
}

export default guildConfig;
