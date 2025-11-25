import ClientCommand, {
	ClientSubCommand,
	ClientSingleSubCommand,
	DefinedClientCommandOption,
	trustMemberRoles,
	trustUserId,
	TypesEnum,
} from "../classes/ClientCommand";
import { Client, REST, Routes } from "discord.js";

import { treat as treatString } from "../utils/string";
import { uniques } from "../utils/array";

import commands from "../commands";
import {
	ClientCommandInteractionOrigin,
	ClientCommandMessageOrigin,
} from "../classes/ClientCommandOrigin";

export function listCommands(): ClientCommand[] {
	return commands;
}

/**
 * Return all possible names for a command (primary name, aliases and localized names).
 * If `treat` is true, the names are normalized using `treatString`.
 */
export function getCommandNames(command: ClientCommand, treat?: boolean) {
	const names = [
		command.name,
		...command.aliases,
		...command.nameLocalizationsList,
	];
	if (treat) return names.map((n) => treatString(n));
	return names;
}
/**
 * Return all names for a subcommand (name + localized names). Optionally normalize them.
 */
export function getSubCommandNames(
	subCommand: ClientSubCommand | ClientSingleSubCommand,
	treat?: boolean
) {
	const names = [subCommand.name, ...subCommand.nameLocalizationsList];
	if (treat) return names.map((n) => treatString(n));
	return names;
}

/**
 * Resolve a command path string into a command or subcommand object.
 * Supports paths like "root", "root sub", and "root group sub".
 */
export function getCommand(
	commandPath: string
): ClientCommand | ClientSingleSubCommand | null {
	if (typeof commandPath !== "string" || commandPath.trim().length === 0)
		return null;
	const args = treatString(commandPath).split(" ");
	const rootCommandName = args.shift()!;
	const rootCommand: ClientCommand | undefined = commands.find((c) =>
		getCommandNames(c, true).includes(rootCommandName)
	);
	if (rootCommand) {
		if (args.length === 0) return rootCommand;
		if (!rootCommand.subcommands) return null;

		const subCommandName = args.shift()!;
		const subCommand = rootCommand.subcommands.find((sub) =>
			getSubCommandNames(sub, true).includes(subCommandName)
		);
		if (subCommand) {
			if (args.length === 0) {
				if (!("execute" in subCommand)) return null;
				return subCommand;
			}

			if (!("groupCommands" in subCommand) || !subCommand.groupCommands)
				return null;

			const internalCommandName = args.shift()!;
			const internalCommand =
				subCommand.groupCommands.find((sub) =>
					getSubCommandNames(sub, true).includes(internalCommandName)
				) || null;
			return internalCommand;
		}
	}

	return null;
}
/**
 * Execute a command path using the provided origin and mapped options.
 * Performs permission, origin and guild checks before calling the command's `execute`.
 */
export async function executeCommand(
	commandPath: string,
	origin: ClientCommandInteractionOrigin | ClientCommandMessageOrigin,
	options: {
		[key: string]:
			| DefinedClientCommandOption[keyof typeof TypesEnum]
			| undefined;
	}
): Promise<any> {
	const rootCommandName = commandPath.split(/\s+/)[0] as string;
	const rootCommand = getCommand(rootCommandName) as ClientCommand;
	if (!rootCommand) throw new Error("Invalid command name");

	const userId = origin.isMessage() ? origin.author.id : origin.user.id;

	if (
		!trustUserId(userId, {
			whitelist: rootCommand?.whitelist?.users,
			blacklist: rootCommand?.blacklist?.users,
		}) ||
		(origin.inGuild() &&
			!trustMemberRoles(
				Array.isArray(origin.member.roles)
					? origin.member.roles
					: origin.member.roles.cache.map((r) => r.id),
				{
					whitelist: rootCommand?.whitelist?.users,
					blacklist: rootCommand?.blacklist?.users,
				}
			))
	)
		throw new Error("Untrusted user");

	if (origin.isMessage()) {
		if (!rootCommand.allowMessage) throw new Error("Invalid origin");
		if (!rootCommand.DMAllowed && origin.channel.isDMBased())
			throw new Error("Command only allowed on guilds");
		if (origin.inGuild()) {
			if (
				rootCommand.guilds.length > 0 &&
				!rootCommand.guilds.includes(origin.guildId)
			)
				throw new Error("Untrusted guild");

			if (
				rootCommand.whitelist?.permissions &&
				!origin.member
					?.permissionsIn(origin.channel)
					.has(rootCommand.whitelist?.permissions, true)
			)
				throw new Error("Untrusted user");
		}
	} else {
		if (!rootCommand.allowSlash) throw new Error("Untrusted origin");
	}

	if (Object.getPrototypeOf(options) !== Object.prototype)
		throw new SyntaxError("Options must be a valid object");

	const command = getCommand(commandPath);
	if (typeof command?.execute !== "function")
		throw new Error("Command execution function is missing");
	return await command.execute(origin, options);
}

/**
 * Register slash commands using Discord REST API. Commands can be registered per-guild
 * (for faster updates) when the command declares `guilds`, otherwise they are registered globally.
 */
export async function handleSlashCommands(
	client: Client<true>,
	silent?: boolean
) {
	if (process.env["DEV_ONLY"] === "true") return;

	const slashCommands = commands.filter((c) => c.allowSlash);
	console.log(
		`[ Commands - handleSlashCommands ] Loading ${slashCommands.length} command(s)`
	);

	const guilds = uniques(slashCommands.flatMap((c) => c.guilds));
	const globalCommands = slashCommands.filter((c) => c.guilds.length === 0);

	const rest = new REST().setToken(client.token);

	if (guilds.length > 0)
		for (const guildId of guilds) {
			const guildCommands = slashCommands.filter((c) =>
				c.guilds.includes(guildId)
			);
			await rest
				.put(Routes.applicationGuildCommands(client.user.id, guildId), {
					body: guildCommands.map((c) => c.slash?.toJSON()),
				})
				.then((data: any) => {
					if (!silent)
						console.log(
							`[ Commands - handleSlashCommands ] Guild '${guildId}' loaded ${data.length} command(s)`
						);
				})
				.catch((error) => {
					console.warn(
						`[ Commands - handleSlashCommands ] Error on handling slash commands for guild '${guildId}'`
					);
					throw error;
				});
		}

	if (globalCommands.length > 0)
		await rest
			.put(Routes.applicationCommands(client.user.id), {
				body: globalCommands.map((c) => c.slash?.toJSON()),
			})
			.then((data: any) => {
				if (!silent)
					console.log(
						`[ Commands - handleSlashCommands ] ${data.length} command(s) loaded`
					);
			})
			.catch((error) => {
				console.warn(
					`[ Commands - handleSlashCommands ] Error on handling slash commands`
				);
				throw error;
			});
}
