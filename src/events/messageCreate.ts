import ClientCommand, {
	DefinedClientCommandOption,
	TypesEnum,
	ClientCommandOption,
	parseChatMessageOption,
	trustGuildMember,
} from "../classes/ClientCommand";
import { getClientConfig } from "../utils/clientConfig";
import { getCommand, executeCommand } from "../handlers/commandsHandler";

import ClientEvent from "../classes/ClientEvent";
import ClientCommandOriginBuilder from "../classes/ClientCommandOrigin";
const event = new ClientEvent("messageCreate").setListener(async (message) => {
	const user = message.author;

	if (message.content === message.client.user.toString())
		return await message.reply({
			content: [
				`> Hello ${user}. This is the automatic message from [Discord.Js TypeScript Template by Erik H. A. Lima](https://github.com/erikhuda/discordjs-template)`,
				`> My prefix for commands is \`${getClientConfig(
					"message_commands_prefix"
				)}\`.`,
				`> Use \`${getClientConfig(
					"message_commands_prefix"
				)}help\` to see the list of available commands.`,
			].join("\n"),
		});

	const prefix = getClientConfig("message_commands_prefix");
	// Only handle message commands when a prefix is configured and the message starts with it
	if (
		typeof prefix === "string" &&
		prefix.length > 0 &&
		message.content.startsWith(prefix)
	) {
		const commandString = message.content.slice(prefix.length);
		const commandArgs = commandString.match(
			/("[^"]*"|'[^']*')|("[^"]*$|'[^']*$)|\S+/g
		);
		if (!commandArgs) return;

		// Normalize arguments: remove surrounding single/double quotes when present
		const args = commandArgs.map((arg) => {
			if (arg.startsWith('"') || arg.startsWith("'")) arg = arg.slice(1);
			if (arg.endsWith('"') || arg.endsWith("'"))
				arg = arg.slice(0, arg.length - 1);
			return arg;
		});

		const rootCommandName = args.shift() as string;
		const rootCommand = getCommand(rootCommandName) as ClientCommand | null;

		let commandPath = rootCommandName;
		if (args[0]) {
			if (getCommand(`${commandPath} ${args[0]}`))
				commandPath += ` ${args.shift()}`;
			else if (args[1] && getCommand(`${commandPath} ${args[0]} ${args[1]}`))
				commandPath += ` ${args.splice(0, 2).join(" ")}`;
		}

		const command = getCommand(commandPath);
		if (!command || !command.execute) return;

		if (message.inGuild() && !trustGuildMember(rootCommand, message.member))
			return await message.reply(
				"> You don't have permission to use this command."
			);

		const options: {
			[key: string]:
				| DefinedClientCommandOption[keyof typeof TypesEnum]
				| undefined;
		} = {};

		if (command.options && command.chatMessageOptionsIndex) {
			// Ensure required args were provided
			if (args.length < command.options.filter((c) => c.required).length)
				return message.reply(
					`> Sorry, but you must specify some parameters to execute this command.\n> - Usage: \`${prefix}${commandPath} ${command.usageString}\``
				);

			for (let i = 0; i < args.length; i++) {
				const optLabel: string = command.chatMessageOptionsIndex[i];
				const restOption = optLabel.startsWith("...");
				const optName = restOption ? optLabel.slice(3) : optLabel;

				const option = command.options.find(
					(o) => o.name === optName
				) as ClientCommandOption<false>;

				// Boolean options can be toggled by naming them directly in the argument list
				if (
					option.type === TypesEnum.Boolean &&
					[
						option.name,
						...(option.nameLocalizations
							? Object.values(option.nameLocalizations)
							: []),
					].some((n) => n && n === args[i].toLowerCase())
				) {
					options[option.name] = true;
					continue;
				}

				const parsedValue = parseChatMessageOption(
					option.type,
					restOption ? args.slice(i).join(" ") : args[i],
					message
				);
				if (!parsedValue && option.required)
					return message.reply(
						`> Need help?\n> Here is how to use this command: \`${prefix}${commandPath} ${command.usageString}\``
					);
				else if (parsedValue) {
					options[optName] = parsedValue;
					if (restOption) break;
				}
			}
		}

		await executeCommand(
			commandPath,
			ClientCommandOriginBuilder(message),
			options
		).catch(async (error) => {
			console.warn(
				`Failed to execute command '${prefix}${commandPath}':`,
				message
			);
			console.error(error);

			await message.reply(
				"> Failed to execute the command. Please notify one of our Adminis."
			);
		});
	}
});

export default event;
