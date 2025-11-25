import ClientCommand, { TypesEnum } from "../classes/ClientCommand";
import { localizedText } from "../utils/message";

import { listCommands } from "../handlers/commandsHandler";

export default new ClientCommand({
	name: "help",
	nameLocalizations: {
		"pt-BR": "ajuda",
	},
	aliases: ["?"],
	description: "List the available commands.",
	descriptionLocalizations: {
		"pt-BR": "Lista os comandos disponíveis.",
	},
	DMAllowed: true,
	options: [
		{
			type: TypesEnum.Boolean,
			name: "detailed",
			nameLocalizations: {
				"pt-BR": "detalhado",
			},
			description: "Show detailed information for each command.",
			descriptionLocalizations: {
				"pt-BR": "Mostra informações detalhadas para cada comando.",
			},
		},
	],
	async onExecute(origin, options) {
		const user = "user" in origin ? origin.user : origin.author;
		const userLang =
			"locale" in origin ? origin.locale : origin.guild?.preferredLocale;

		const commands = listCommands();
		const commandList = [
			options["detailed"]
				? commands.map(
						(cmd) =>
							`- \`${
								localizedText(cmd.nameLocalizations, userLang) || cmd.name
							}\`${
								cmd.aliases.length
									? ` [${cmd.aliases.map((a) => `\`${a}\``).join(", ")}]`
									: ""
							}: ${
								localizedText(cmd.descriptionLocalizations, userLang) ||
								cmd.description
							}`
				  )
				: commands.map(
						(cmd) =>
							`- \`${
								localizedText(cmd.nameLocalizations, userLang) || cmd.name
							}\`${
								cmd.aliases.length
									? ` [${cmd.aliases.map((a) => `\`${a}\``).join(", ")}]`
									: ""
							}: ${
								localizedText(cmd.descriptionLocalizations, userLang) ||
								cmd.description
							}`
				  ),
		];

		return await origin.reply({
			content:
				localizedText(
					{
						"pt-BR": `> Olá, ${user.toString()}! Aqui está a lista de comandos disponíveis:\n\n${commandList.join(
							"\n"
						)}`,
					},
					userLang
				) ||
				`> Hello, ${user.toString()}! Here is the list of available commands:\n\n${commandList.join(
					"\n"
				)}`,
			ephemeral: true,
		});
	},
});
