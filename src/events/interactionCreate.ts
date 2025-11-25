import { ApplicationCommandOptionType } from "discord.js";

import ClientCommand, {
	ClientCommandAutocompletableOption,
	DefinedClientCommandOption,
	trustGuildMember,
	TypesEnum,
} from "../classes/ClientCommand";
import { executeCommand, getCommand } from "../handlers/commandsHandler";

import ClientEvent from "../classes/ClientEvent";
import ClientCommandOriginBuilder from "../classes/ClientCommandOrigin";

const event = new ClientEvent("interactionCreate");
event.setListener(async (interaction) => {
	// Chat input command handling
	if (interaction.isChatInputCommand()) {
		if (process.env["DEV_ONLY"] === "true") return;
		let commandPath = interaction.commandName;
		const rootCommand = getCommand(commandPath) as ClientCommand | null;

		// Extract subcommand group/options when present to build the full command path
		let options = interaction.options.data;
		const subcommandGroup = options.find(
			(o) => o.type === ApplicationCommandOptionType.SubcommandGroup
		);
		if (subcommandGroup) {
			commandPath += " " + subcommandGroup.name;
			if (subcommandGroup.options) options = subcommandGroup.options;
		}

		const subcommand = options.find(
			(o) => o.type === ApplicationCommandOptionType.Subcommand
		);
		if (subcommand) {
			commandPath += " " + subcommand.name;
			if (subcommand.options) options = subcommand.options;
		}

		const command =
			interaction.commandName !== commandPath
				? getCommand(commandPath)
				: rootCommand;
		if (!command || !rootCommand)
			return await interaction.reply({
				content: `> Command \`/${commandPath}\` not found.`,
				flags: ["Ephemeral"],
			});

		if (!trustGuildMember(rootCommand, interaction.member))
			return await interaction.reply({
				content: `> You do not have permission to use this command.`,
				flags: ["Ephemeral"],
			});

		// Build a simplified options map to pass to the command executor
		const defOptions: {
			[key: string]:
				| DefinedClientCommandOption[keyof typeof TypesEnum]
				| undefined;
		} = {};

		for (const op of options)
			defOptions[op.name] =
				op.channel ||
				(op.user && op.member
					? { user: op.user, member: op.member }
					: op.user) ||
				op.role ||
				op.attachment ||
				op.value;

		await executeCommand(
			commandPath,
			ClientCommandOriginBuilder(interaction),
			defOptions
		).catch(async (error) => {
			// Log details and respond with a friendly message for unexpected errors
			console.warn(`Failed to execute command '/${commandPath}':`, interaction);
			console.error(error);

			const content =
				"> Failed to execute the command. Please notify our Staff.";

			if (interaction.replied || interaction.deferred)
				await interaction.editReply({ content, embeds: [] });
			else
				await interaction.reply({
					content,
					embeds: [],
					flags: ["Ephemeral"],
				});
		});
	} else if (interaction.isAutocomplete()) {
		// Autocomplete handling: map focused option to the command definition and call its handler
		if (process.env["DEV_ONLY"] === "true") return;
		let commandPath = interaction.commandName;
		const rootCommand = getCommand(commandPath) as ClientCommand | null;

		let options = interaction.options.data;
		const subcommandGroup = options.find(
			(o) => o.type === ApplicationCommandOptionType.SubcommandGroup
		);
		if (subcommandGroup) commandPath += " " + subcommandGroup.name;

		const subcommand = (subcommandGroup?.options || options).find(
			(o) => o.type === ApplicationCommandOptionType.Subcommand
		);
		if (subcommand) commandPath += " " + subcommand.name;

		const command =
			commandPath !== interaction.commandName
				? getCommand(commandPath)
				: rootCommand;

		if (
			!command ||
			!rootCommand ||
			!trustGuildMember(rootCommand, interaction.member)
		)
			return await interaction.respond([]);

		const focused = interaction.options.getFocused(true);
		const option = command.options?.find(
			(o) => o.name === focused.name
		) as ClientCommandAutocompletableOption;
		if (
			!option ||
			!option.autocomplete ||
			typeof option.onAutocomplete !== "function"
		)
			return await interaction.respond([]);

		return await option.onAutocomplete(interaction, focused.value);
	}
});

export default event;
