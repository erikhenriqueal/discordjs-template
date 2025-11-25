import { ChatInputCommandInteraction } from "discord.js";
import ClientCommand, { TypesEnum } from "../classes/ClientCommand";
import { localizedText } from "../utils/message";

export default new ClientCommand({
	name: "example",
	nameLocalizations: {
		"pt-BR": "exemplo",
	},
	description: "This is an example command.",
	descriptionLocalizations: {
		"pt-BR": "Este é um comando de exemplo.",
	},
	options: [
		{
			type: TypesEnum.Boolean,
			name: "greet",
			nameLocalizations: {
				"pt-BR": "cumprimentar",
			},
			description: "Hello, world!",
			descriptionLocalizations: {
				"pt-BR": "Olá, mundo!",
			},
		},
	],
	chatMessageOptionsIndex: ["greet"],
	DMAllowed: true,
	async onExecute(origin, options) {
		const user = "user" in origin ? origin.user : origin.author;
		const userLang =
			"locale" in origin ? origin.locale : origin.guild?.preferredLocale;

		if (options["greet"])
			return await origin.reply({
				content:
					localizedText(
						{
							"pt-BR": `> Olá, ${user.toString()}!`, // Message for Brazilian users, like me
						},
						userLang
					) || `> Hello, ${user.toString()}!`, // Defining the default value for the message
				ephemeral: true, // Enables Ephemeral (private) message for SlashCommand's reply
			});

		// Slash Commands requires replies.
		// So, if there's no 'greet' option, or it's false,
		// the interaction is replied and then deleted.
		// Using catch to prevent it for throwing unhandled errors.
		if (origin instanceof ChatInputCommandInteraction)
			await origin
				.deferReply()
				.then((r) => r.delete())
				.catch(() => {});
	},
});
