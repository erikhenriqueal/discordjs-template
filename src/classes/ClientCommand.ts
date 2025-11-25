import {
	/** Importing utilities. */
	Awaitable,
	ChatInputCommandInteraction as DiscordChatInputCommandInteraction,
	AutocompleteInteraction as DiscordAutocompleteInteraction,
	Message as DiscordMessage,

	/** Importing options typings. */
	APIApplicationCommandOptionChoice,
	ApplicationCommandOptionAllowedChannelTypes,
	Locale,
	LocalizationMap,
	PermissionFlags,
	PermissionFlagsBits,

	/** Importing defined options value's types. */
	Attachment,
	APIInteractionDataResolvedChannel,
	Channel,
	APIInteractionDataResolvedGuildMember,
	GuildMember,
	APIRole,
	Role,
	User,

	/** Importing slash command builders. */
	SlashCommandBuilder,
	SlashCommandStringOption,
	SlashCommandBooleanOption,
	SlashCommandChannelOption,
	SlashCommandIntegerOption,
	SlashCommandNumberOption,
	SlashCommandUserOption,
	SlashCommandRoleOption,
	SlashCommandMentionableOption,
	SlashCommandAttachmentOption,
	SlashCommandSubcommandBuilder,
	APIInteractionGuildMember,
	PermissionsString,
	CacheType,
	EmbedBuilder,
	APIEmbed,
	ColorResolvable,
	InteractionReplyOptions,
} from "discord.js";
import {
	ClientCommandInteractionOrigin,
	ClientCommandMessageOrigin,
} from "./ClientCommandOrigin";

export type LanguagesStringMap = Partial<Record<Locale, string>>;

interface BasicSlashCommandOption {
	String: SlashCommandStringOption;
	Integer: SlashCommandIntegerOption;
	Number: SlashCommandNumberOption;
	Boolean: SlashCommandBooleanOption;
	Channel: SlashCommandChannelOption;
	User: SlashCommandUserOption;
	Role: SlashCommandRoleOption;
	Mentionable: SlashCommandMentionableOption;
	Attachment: SlashCommandAttachmentOption;
}
interface AutocompletableSlashCommandOption {
	String:
		| Omit<SlashCommandStringOption, "addChoices">
		| Omit<SlashCommandStringOption, "setAutocomplete">
		| SlashCommandStringOption;
	Integer:
		| Omit<SlashCommandIntegerOption, "addChoices">
		| Omit<SlashCommandIntegerOption, "setAutocomplete">
		| SlashCommandIntegerOption;
	Number:
		| Omit<SlashCommandNumberOption, "addChoices">
		| Omit<SlashCommandNumberOption, "setAutocomplete">
		| SlashCommandNumberOption;
}

export enum TypesEnum {
	String = 3,
	Integer = 4,
	Boolean = 5,
	User = 6,
	Channel = 7,
	Role = 8,
	Mentionable = 9,
	Number = 10,
	Attachment = 11,
}

export interface DefinedClientCommandOption {
	String: string;
	Integer: number;
	Boolean: boolean;
	User: {
		user: User;
		member: APIInteractionDataResolvedGuildMember | GuildMember;
	};
	Channel: APIInteractionDataResolvedChannel | Channel;
	Role: Role | APIRole;
	Mentionable: User | APIRole | Role;
	Number: number;
	Attachment: Attachment;
}

export interface ClientCommandBasicOption {
	name: string;
	nameLocalizations: LanguagesStringMap | null;
	description: string;
	descriptionLocalizations: LanguagesStringMap | null;
	required: boolean;
}
export type ClientCommandAutocompletableOption<ChoicesType = string | number> =
	| (ClientCommandBasicOption & {
			autocomplete: false;
			choices: APIApplicationCommandOptionChoice<ChoicesType>[];
	  })
	| (ClientCommandBasicOption & {
			autocomplete: true;
			onAutocomplete(
				interaction: DiscordAutocompleteInteraction,
				query: ChoicesType
			): Awaitable<any>;
	  });

export interface ClientCommandBasicOptionBuilder {
	name: string;
	nameLocalizations?: LanguagesStringMap;
	description: string;
	descriptionLocalizations?: LanguagesStringMap;
	required?: true;
}
export type ClientCommandAutocompletableOptionBuilder<
	ChoicesType = string | number
> =
	| (ClientCommandBasicOptionBuilder & {
			autocomplete?: false;
			choices?: APIApplicationCommandOptionChoice<ChoicesType>[];
	  })
	| (ClientCommandBasicOptionBuilder & {
			autocomplete: true;
			onAutocomplete(
				interaction: DiscordAutocompleteInteraction,
				query: ChoicesType
			): Awaitable<any>;
	  });

export type ClientCommandBooleanOption<
	Base extends ClientCommandBasicOption | ClientCommandBasicOptionBuilder
> = { type: TypesEnum.Boolean } & Base;
export type ClientCommandAttachmentOption<
	Base extends ClientCommandBasicOption | ClientCommandBasicOptionBuilder
> = { type: TypesEnum.Attachment } & Base;
export type ClientCommandChannelOption<
	Base extends ClientCommandBasicOption | ClientCommandBasicOptionBuilder
> = {
	type: TypesEnum.Channel;
	channelTypes?: ApplicationCommandOptionAllowedChannelTypes[];
} & Base;
export type ClientCommandUserOption<
	Base extends ClientCommandBasicOption | ClientCommandBasicOptionBuilder
> = { type: TypesEnum.User } & Base;
export type ClientCommandRoleOption<
	Base extends ClientCommandBasicOption | ClientCommandBasicOptionBuilder
> = { type: TypesEnum.Role } & Base;
export type ClientCommandMentionableOption<
	Base extends ClientCommandBasicOption | ClientCommandBasicOptionBuilder
> = { type: TypesEnum.Mentionable } & Base;
export type ClientCommandStringOption<
	Base extends
		| ClientCommandAutocompletableOption<string>
		| ClientCommandAutocompletableOptionBuilder<string>
> = { type: TypesEnum.String; minLength?: number; maxLength?: number } & Base;
export type ClientCommandIntegerOption<
	Base extends
		| ClientCommandAutocompletableOption<number>
		| ClientCommandAutocompletableOptionBuilder<number>
> = { type: TypesEnum.Integer; minValue?: number; maxValue?: number } & Base;
export type ClientCommandNumberOption<
	Base extends
		| ClientCommandAutocompletableOption<number>
		| ClientCommandAutocompletableOptionBuilder<number>
> = { type: TypesEnum.Number; minValue?: number; maxValue?: number } & Base;

export type ClientCommandOption<Builder extends boolean = false> =
	| ClientCommandBooleanOption<
			Builder extends true
				? ClientCommandBasicOptionBuilder
				: ClientCommandBasicOption
	  >
	| ClientCommandAttachmentOption<
			Builder extends true
				? ClientCommandBasicOptionBuilder
				: ClientCommandBasicOption
	  >
	| ClientCommandChannelOption<
			Builder extends true
				? ClientCommandBasicOptionBuilder
				: ClientCommandBasicOption
	  >
	| ClientCommandUserOption<
			Builder extends true
				? ClientCommandBasicOptionBuilder
				: ClientCommandBasicOption
	  >
	| ClientCommandRoleOption<
			Builder extends true
				? ClientCommandBasicOptionBuilder
				: ClientCommandBasicOption
	  >
	| ClientCommandMentionableOption<
			Builder extends true
				? ClientCommandBasicOptionBuilder
				: ClientCommandBasicOption
	  >
	| ClientCommandStringOption<
			Builder extends true
				? ClientCommandAutocompletableOptionBuilder<string>
				: ClientCommandAutocompletableOption<string>
	  >
	| ClientCommandIntegerOption<
			Builder extends true
				? ClientCommandAutocompletableOptionBuilder<number>
				: ClientCommandAutocompletableOption<number>
	  >
	| ClientCommandNumberOption<
			Builder extends true
				? ClientCommandAutocompletableOptionBuilder<number>
				: ClientCommandAutocompletableOption<number>
	  >;

export interface ClientSubCommandBase {
	name: string;
	nameLocalizations: LanguagesStringMap | null;
	nameLocalizationsList: string[];
	description: string;
	descriptionLocalizations: LanguagesStringMap | null;
}
export interface ClientSingleSubCommand extends ClientSubCommandBase {
	options: ClientCommandOption<false>[] | null;
	chatMessageOptionsIndex: string[] | null;
	execute<Origin extends DiscordMessage | DiscordChatInputCommandInteraction>(
		origin: Origin,
		options: {
			[key: string]:
				| DefinedClientCommandOption[keyof typeof TypesEnum]
				| undefined;
		}
	): Awaitable<any>;
	usageString: string;
}
export interface ClientSubCommandGroup extends ClientSubCommandBase {
	groupCommands: ClientSingleSubCommand[] | null;
}

export interface ClientSubCommandBaseBuilder {
	name: string;
	nameLocalizations?: LanguagesStringMap;
	description: string;
	descriptionLocalizations?: LanguagesStringMap;
}
export interface ClientSingleSubCommandBuilder
	extends ClientSubCommandBaseBuilder {
	options?: ClientCommandOption<true>[];
	chatMessageOptionsIndex?: string[];
	onExecute(
		origin: ClientCommandInteractionOrigin | ClientCommandMessageOrigin,
		options: {
			[key: string]:
				| DefinedClientCommandOption[keyof typeof TypesEnum]
				| undefined;
		}
	): Awaitable<any>;
}
export interface ClientSubCommandGroupBuilder
	extends ClientSubCommandBaseBuilder {
	groupCommands: ClientSingleSubCommandBuilder[];
}

export type ClientSubCommand = ClientSingleSubCommand | ClientSubCommandGroup;
export type ClientSubCommandBuilder =
	| ClientSingleSubCommandBuilder
	| ClientSubCommandGroupBuilder;

export interface ClientCommandPermission {
	permissions: bigint | null;
	users: string[] | null;
	roles: string[] | null;
}
export interface ClientCommandPermissionBuilder {
	/** Discord's Permissions Flags. */
	permissions?: (keyof PermissionFlags)[];
	/**
	 * Supports User IDs only.
	 * Since Slash Commands doesn't support users filtering, it is really recommend to disable `allowSlash`.
	 */
	users?: string[];
	/**
	 * Supports Roles Names and IDs.
	 * Since Slash Commands doesn't support roles filtering, it is really recommend to disable `allowSlash`.
	 */
	roles?: string[];
}

export interface ClientCommandBaseBuilder {
	/** Command real name used by both Slash and Chat Message commands. (lowercase parsed only for Slash Commands) */
	name: string;
	/** Optional aliases to execute this command using aliases in Chat Messages. */
	aliases?: string[];
	/** Additional names for multiple languages support. */
	nameLocalizations?: LanguagesStringMap;
	/** Simple description to explain your command's functionality. */
	description: string;
	/** Additional descriptions for multiple languages support. */
	descriptionLocalizations?: LanguagesStringMap;
	/** Whether the command should be registered as a Discord Slash Command. (default `true`) */
	allowSlash?: boolean;
	/** Whether the command should be runned using chat messages with prefix. (default `true`) */
	allowMessage?: boolean;
	/** Whether the command should work only on NSFW channels. (default `false`) */
	isNSFW?: boolean;
	/**
	 * Whether the command should be registered and executed only in specific guilds.
	 * Supports only Guilds IDs.
	 */
	guilds?: string[];
	/** Whether the command could also be executed in Direct Messages. (default `false`) */
	DMAllowed?: boolean;
	/** Optional authors whitelist to trust your command usage. */
	whitelist?: ClientCommandPermissionBuilder;
	/** Optional authors blacklist to deny your command usage. */
	blacklist?: Omit<ClientCommandPermissionBuilder, "permissions">;
}
export interface ClientCommandWithOptionsBuilder
	extends ClientCommandBaseBuilder {
	/**
	 * Additional options to create your command.
	 *
	 * @example
	 * ```
	 * // - - - Usage - - - //
	 * const command = new ClientCommand({
	 *   name: "ban",
	 *   description: "Ban some user from the actual server.",
	 *   DMAllowed: false,
	 *   allowMessage: false,
	 *   trustedAuthors: { permissions: PermissionFlagsBits.Administrator },
	 *   options: {
	 *     user: [ builder => builder.setName("target user").setDescription("Target user to promote.").setRequire(true) ]
	 *   },
	 *   execute(origin, options) {
	 *     // ... //
	 *   }
	 * });
	 * ```
	 */
	options?: ClientCommandOption<true>[];
	/**
	 * It's required for Chat Message commands wich has `options`.
	 * The list indexes every value name from `options` and uses it's sequence to call Chat Message command.
	 *
	 * @example
	 * ```
	 * // - - - Usage - - - //
	 * import ClientCommand, { TypesEnum } from "ClientCommand.ts";
	 * import { PermissionFlagsBits } from "discord.js";
	 *
	 * const command = new ClientCommand({
	 *   name: "promote",
	 *   description: "Promotes a user to a specified role.",
	 *   DMPermission: false,
	 *   trustedAuthors: { permissions: [ PermissionFlagsBits.Administrator ] },
	 *   options: [
	 *     { type: TypesEnum.Boolean, name: "notify", description: "Whether the target user should be notified when promoted." },
	 *     { type: TypesEnum.Role, name: "notify", description: "Role to append to user.", required: true },
	 *     { type: TypesEnum.User, name: "user", description: "Target user to promote.", required: true }
	 *   ],
	 *   // The sequence of arguments in order
	 *   chatMessageOptionsIndex: [ "user", "role", "notify" ],
	 *   execute(origin, options) {
	 *     // ... //
	 *   }
	 * });
	 * ```
	 */
	chatMessageOptionsIndex?: string[];
	onExecute(
		origin: ClientCommandInteractionOrigin | ClientCommandMessageOrigin,
		options: {
			[key: string]:
				| DefinedClientCommandOption[keyof typeof TypesEnum]
				| undefined;
		}
	): Awaitable<any>;
}
export interface ClientCommandWithSubcommandsBuilder
	extends ClientCommandBaseBuilder {
	/**
	 * If `subcommands` are included, the main command won't be able to be executed alone. `subcommands` works as a Discord's `SlashCommandSubcommand` or `SlashCommandSubcommandGroup`.
	 */
	subcommands?: ClientSubCommandBuilder[];
}
export type ClientCommandBuilder =
	| ClientCommandWithOptionsBuilder
	| ClientCommandWithSubcommandsBuilder;

// - - - External Helpers - - - //

export function buildEmbedBase(
	origin:
		| ClientCommandInteractionOrigin<CacheType>
		| ClientCommandMessageOrigin<boolean>,
	options?: {
		useDefaultAuthor?: false;
		useDefaultTimestamp?: false;
		useDefaultFooter?: false;
		color?: ColorResolvable;
	}
) {
	const base = new EmbedBuilder();
	const originUser = origin.isMessage() ? origin.author : origin.user;
	if (options?.useDefaultAuthor !== false)
		base.setAuthor({
			name: `${
				originUser.displayName || originUser.globalName || originUser.username
			}`,
			iconURL: `${(origin.member as GuildMember).displayAvatarURL({
				size: 64,
			})}`,
		});
	if (options?.useDefaultTimestamp !== false) base.setTimestamp(Date.now());
	if (options?.useDefaultFooter !== false)
		base.setFooter({
			text: origin.client.user.username,
			iconURL: origin.client.user.displayAvatarURL({
				size: 32,
			}),
		});
	if (options?.color) base.setColor(options.color);

	return base.data;
}

export function buildEmbed(base: APIEmbed) {
	return new EmbedBuilder(base);
}

export async function reply<
	Origin extends ClientCommandMessageOrigin | ClientCommandInteractionOrigin,
	Options = Origin extends ClientCommandInteractionOrigin
		? InteractionReplyOptions
		: ClientCommandMessageOrigin
>(origin: Origin, options: string | Options) {
	return await origin.reply(options);
}
export async function ephemeralReply(
	origin:
		| ClientCommandInteractionOrigin<CacheType>
		| ClientCommandMessageOrigin<boolean>,
	options: string | { embeds: EmbedBuilder[] }
) {
	return await (origin.isInteraction()
		? origin.reply(
				typeof options === "string"
					? { flags: ["Ephemeral"], content: options }
					: { flags: ["Ephemeral"], ...options }
		  )
		: origin.reply(options));
}

// - - - Global Parsers - - - //

export function parseLocalizations(
	localizations: LocalizationMap | LanguagesStringMap | null | undefined
): LanguagesStringMap | null {
	if (localizations === null || localizations === undefined) return null;
	if (Object.prototype !== Object.getPrototypeOf(localizations))
		throw new SyntaxError("Localizations must be an Object");

	const localizationsEntries = Object.entries(localizations).filter(
		([k, v]) =>
			Object.values(Locale).includes(k as Locale) && typeof v === "string"
	);
	if (localizationsEntries.length === 0) return null;

	return Object.fromEntries(localizationsEntries);
}

// - - - Primary Parsers - - - //

export function parseChoices<
	Type = "string" | "number",
	ValueType = Type extends "string" ? string : number
>(
	type: Type,
	choices?: APIApplicationCommandOptionChoice<ValueType>[]
): APIApplicationCommandOptionChoice<ValueType>[] {
	if (!choices) return [];
	for (const choice of choices) {
		if (typeof choice.name !== "string" || choice.name.length === 0)
			throw new SyntaxError(`Invalid choice name '${choice.name}'`);
		if (typeof choice.value !== type)
			throw new SyntaxError(
				`'${choice.value}' choice value is not assignable to type '${type}'`
			);
	}

	return choices.map((c) => ({
		name: c.name,
		name_localizations: parseLocalizations(c.name_localizations),
		value: c.value,
	}));
}
export function parseOption(
	option: ClientCommandOption<true>
): ClientCommandOption<false> {
	if (Object.prototype !== Object.getPrototypeOf(option))
		throw new SyntaxError("Invalid 'option' parameter type");
	if (typeof option.type !== "number" || !(option.type in TypesEnum))
		throw new SyntaxError(`Invalid option 'type' \'${option.type}\'`);
	if (typeof option.name !== "string" || option.name.length === 0)
		throw new SyntaxError(`Invalid option name '${option.name}'`);
	if (typeof option.description !== "string" || option.description.length === 0)
		throw new SyntaxError(`Invalid option description '${option.description}'`);

	if (
		option.type === TypesEnum.String ||
		option.type === TypesEnum.Integer ||
		option.type === TypesEnum.Number
	) {
		if (option.type === TypesEnum.String) {
			if (option.minLength && typeof option.minLength !== "number")
				throw new SyntaxError("Option 'minLength' value must be a number");
			if (option.maxLength && typeof option.maxLength !== "number")
				throw new SyntaxError("Option 'maxLength' value must be a number");
		} else {
			if (option.minValue && typeof option.minValue !== "number")
				throw new SyntaxError("Option 'minValue' value must be a number");
			if (option.maxValue && typeof option.maxValue !== "number")
				throw new SyntaxError("Option 'maxValue' value must be a number");
		}

		if (option.autocomplete === true) {
			if ((option as any).choices && (option as any).choices.length > 0)
				throw new SyntaxError("Autocompletable options can't include choices");
			if (
				(option as any).onAutocomplete &&
				typeof option.onAutocomplete !== "function"
			)
				throw new SyntaxError(
					"Autocompletable option 'onAutocomplete' must be a function"
				);
		}

		const parsedChoices =
			option.autocomplete === false
				? option.type === TypesEnum.String
					? parseChoices("string", option.choices)
					: parseChoices("number", option.choices)
				: [];

		return {
			type: option.type,
			name: option.name,
			description: option.description,
			nameLocalizations: parseLocalizations(option.nameLocalizations),
			descriptionLocalizations: parseLocalizations(
				option.descriptionLocalizations
			),
			required: typeof option.required === "boolean" ? option.required : false,
			autocomplete:
				typeof option.autocomplete === "boolean" ? option.autocomplete : false,
			choices: parsedChoices,
			onAutocomplete: option.autocomplete ? option.onAutocomplete : undefined,
		} as ClientCommandOption<false>;
	}
	return {
		type: option.type,
		name: option.name,
		description: option.description,
		nameLocalizations: parseLocalizations(option.nameLocalizations),
		descriptionLocalizations: parseLocalizations(
			option.descriptionLocalizations
		),
		required: typeof option.required === "boolean" ? option.required : false,
	} as ClientCommandOption<false>;
}
export function parseChatMessageOptions(
	options: ClientCommandOption<false>[],
	chatMessageOptionsIndex: string[]
): string[] {
	if (!Array.isArray(options))
		throw new SyntaxError("Options must be an Array");
	if (!Array.isArray(chatMessageOptionsIndex))
		throw new SyntaxError("Indexer must be an Array");

	if (
		chatMessageOptionsIndex.some((n) => typeof n !== "string" || n.length === 0)
	)
		throw new SyntaxError(`Indexer has invalid values`);

	const indexer = chatMessageOptionsIndex.map((n) => n.trim().toLowerCase());

	const restOptions = indexer.filter((n) => n.startsWith("..."));
	if (
		restOptions.length &&
		(restOptions.length > 1 ||
			indexer.indexOf(restOptions[0]) !== indexer.length - 1)
	)
		throw new SyntaxError(
			"Indexer can have only one rest option that should be the last one"
		);

	const requiredOptions = options.filter((o) => o.required).map((o) => o.name);
	if (
		requiredOptions.some(
			(req) =>
				!indexer
					.map((n) => (n.startsWith("...") ? n.slice(3) : n))
					.includes(req)
		)
	)
		throw new SyntaxError(
			`Chat Message command options indexer is missing some required option`
		);

	const unsupportedOptions = options
		.filter((o) => o.type === TypesEnum.Attachment)
		.map((o) => o.name);
	if (unsupportedOptions.length > 0)
		throw new SyntaxError(
			`Actually Attachment options isn't supported by Chat Message commands`
		);

	return indexer;
}
export function parseSubcommand<Groups extends boolean = false>(
	subcommand: ClientSubCommandBuilder,
	trustGroups?: Groups
): Groups extends false ? ClientSingleSubCommand : ClientSubCommand {
	if (Object.getPrototypeOf(subcommand) !== Object.prototype)
		throw new SyntaxError("Subcommand must be an Object");
	if (
		typeof subcommand.name !== "string" ||
		subcommand.name.trim().length === 0
	)
		throw new SyntaxError(
			`Invalid subcommand name '${subcommand.name.trim()}'`
		);
	if (
		typeof subcommand.description !== "string" ||
		subcommand.description.trim().length === 0
	)
		throw new SyntaxError("Invalid subcommand description");

	const parsed: any = {
		name: subcommand.name.trim().toLowerCase(),
		nameLocalizations: parseLocalizations(subcommand.nameLocalizations),
		description: subcommand.description.trim(),
		descriptionLocalizations: parseLocalizations(
			subcommand.descriptionLocalizations
		),
	};
	parsed.nameLocalizationsList = Object.values(parsed.nameLocalizations || {});

	if ("groupCommands" in subcommand) {
		if (!trustGroups)
			throw new SyntaxError(
				"Subcommands don't support nested subcommands groups"
			);
		parsed.groupCommands = subcommand.groupCommands.map((sub) =>
			parseSubcommand(sub, false)
		);
		return parsed;
	}

	if (subcommand.options) {
		parsed.options = subcommand.options.map(parseOption);
		if (subcommand.chatMessageOptionsIndex) {
			parsed.chatMessageOptionsIndex = parseChatMessageOptions(
				parsed.options,
				subcommand.chatMessageOptionsIndex
			);
			const requiredOptions = parsed.options
				.filter((o: ClientCommandOption<false>) => o.required)
				.map((o: ClientCommandOption<false>) => o.name);
			parsed.usageString = parsed.chatMessageOptionsIndex
				.map((n: string) => `<${n}${!requiredOptions.includes(n) ? "?" : ""}>`)
				.join(" ");
		}
	} else parsed.usageString = "";

	if (typeof subcommand.onExecute !== "function")
		throw new SyntaxError(
			"Subcommand must have 'onExecute' method to handle it's execution"
		);
	parsed.execute = subcommand.onExecute;

	return parsed;
}

// - - - Secondary Parsers - - - //

export function parseChatMessageOption(
	type: TypesEnum,
	value: string,
	message: DiscordMessage
) {
	if (type === TypesEnum.Attachment) return null;
	else if (type === TypesEnum.String) return value;
	else if (type === TypesEnum.Number) return parseFloat(value);
	else if (type === TypesEnum.Integer) return parseInt(value);
	else if (type === TypesEnum.Boolean) return true;
	else if (type === TypesEnum.Channel) {
		const match = value.match(/^<#(\d+)>$/);
		if (match === null) return null;
		return message.client.channels.resolve(match[1]);
	} else if (
		type === TypesEnum.Mentionable ||
		type === TypesEnum.Role ||
		type === TypesEnum.User
	) {
		if (!message.inGuild()) return null;
		const match = value.match(/^<@(&?)(\d+)>$/);
		if (match === null) return null;
		if (match[1] === "") {
			if (type === TypesEnum.Role) return null;
			const user = message.client.users.resolve(match[2]);
			const member = message.guild.members.resolve(match[2]);
			if (!user || !member) return null;
			return { user, member };
		}
		return message.guild.roles.resolve(match[2]);
	}
}

// - - - Internal Utilities - - - //

export function addClientOptions<
	Target extends SlashCommandBuilder | SlashCommandSubcommandBuilder
>(target: Target, options: ClientCommandOption<false>[]): Target {
	for (const option of options) {
		switch (option.type) {
			case TypesEnum.Boolean:
				target.addBooleanOption((input) =>
					commandBuilder<"Boolean">(option, input)
				);
				break;
			case TypesEnum.Channel:
				target.addChannelOption((input) =>
					commandBuilder<"Channel">(option, input)
				);
				break;
			case TypesEnum.Integer:
				target.addIntegerOption((input) =>
					commandBuilder<"Integer">(option, input)
				);
				break;
			case TypesEnum.Number:
				target.addNumberOption((input) =>
					commandBuilder<"Number">(option, input)
				);
				break;
			case TypesEnum.User:
				target.addUserOption((input) => commandBuilder<"User">(option, input));
				break;
			case TypesEnum.Role:
				target.addRoleOption((input) => commandBuilder<"Role">(option, input));
				break;
			case TypesEnum.Mentionable:
				target.addMentionableOption((input) =>
					commandBuilder<"Mentionable">(option, input)
				);
				break;
			case TypesEnum.Attachment:
				target.addAttachmentOption((input) =>
					commandBuilder<"Attachment">(option, input)
				);
				break;
			case TypesEnum.String:
				target.addStringOption((input) =>
					commandBuilder<"String">(option, input)
				);
				break;
			default:
				throw new Error(`Failed to process option type '${option["type"]}'`);
		}
	}
	return target;

	function commandBuilder<Type extends keyof typeof TypesEnum>(
		option: ClientCommandOption<false>,
		input: BasicSlashCommandOption[Type]
	): Type extends TypesEnum.String | TypesEnum.Integer | TypesEnum.Number
		? AutocompletableSlashCommandOption[Type]
		: BasicSlashCommandOption[Type] {
		input
			.setName(option.name)
			.setDescription(option.name)
			.setNameLocalizations(option.nameLocalizations)
			.setDescriptionLocalizations(option.descriptionLocalizations)
			.setRequired(option.required);

		if (
			option.type === TypesEnum.String ||
			option.type === TypesEnum.Integer ||
			option.type === TypesEnum.Number
		) {
			if (option.autocomplete && "setAutocomplete" in input)
				input.setAutocomplete(true);
			if (
				!option.autocomplete &&
				"choices" in option &&
				"addChoices" in input &&
				option.choices.length > 0
			)
				input.addChoices(...(option.choices as any));
			if (option.type === TypesEnum.String) {
				if (option.minLength)
					(input as BasicSlashCommandOption["String"]).setMinLength(
						option.minLength
					);
				if (option.maxLength)
					(input as BasicSlashCommandOption["String"]).setMaxLength(
						option.maxLength
					);
			} else if (
				option.type === TypesEnum.Integer ||
				option.type === TypesEnum.Number
			) {
				if (option.minValue)
					(input as BasicSlashCommandOption["Integer" | "Number"]).setMinValue(
						option.minValue
					);
				if (option.maxValue)
					(input as BasicSlashCommandOption["Integer" | "Number"]).setMaxValue(
						option.maxValue
					);
			}
		}

		return input as any;
	}
}

// - - - External Utilities - - - //

export function trustUserId(
	userId: string,
	{ whitelist, blacklist }: { whitelist?: string[]; blacklist?: string[] }
): boolean {
	if (whitelist && whitelist.length > 0 && !whitelist.includes(userId))
		return false;
	if (blacklist && blacklist.length > 0 && blacklist.includes(userId))
		return false;

	return true;
}

export function trustMemberRoles(
	roles: string[],
	{ whitelist, blacklist }: { whitelist?: string[]; blacklist?: string[] }
): boolean {
	if (
		whitelist &&
		whitelist.length > 0 &&
		!whitelist.some((r) => roles.includes(r))
	)
		return false;
	if (
		blacklist &&
		blacklist.length > 0 &&
		blacklist.some((r) => roles.includes(r))
	)
		return false;

	return true;
}

export function trustMemberPermissions(
	memberPermissions: PermissionsString[],
	{
		whitelist,
		blacklist,
	}: { whitelist?: PermissionsString[]; blacklist?: PermissionsString[] }
) {
	if (whitelist && !whitelist.some((p) => memberPermissions.includes(p)))
		return false;

	if (blacklist && blacklist.some((p) => memberPermissions.includes(p)))
		return false;

	return true;
}

export function trustGuildMember(
	command: ClientCommand,
	member: GuildMember | APIInteractionGuildMember
): boolean {
	return (
		trustUserId(member.user.id, {
			whitelist: command?.whitelist?.users,
			blacklist: command?.blacklist?.users,
		}) &&
		trustMemberRoles(
			Array.isArray(member.roles)
				? member.roles
				: member.roles.cache.map((r) => r.id),
			{
				whitelist: command?.whitelist?.users,
				blacklist: command?.blacklist?.users,
			}
		)
	);
}

export default class ClientCommand {
	private _slash?: SlashCommandBuilder;
	private _name: string;
	private _nameLocalizations?: LanguagesStringMap;
	private _aliases?: string[];
	private _description: string;
	private _descriptionLocalizations?: LanguagesStringMap;
	private _guilds?: string[];
	private _options?: ClientCommandOption<false>[];
	private _chatMessageOptionsIndex?: string[];
	private _whitelist?: ClientCommandPermission;
	private _blacklist?: Omit<ClientCommandPermission, "permissions">;
	private _subcommands?: ClientSubCommand[];

	/** Whether the command should be registered as a Discord Slash Command. (default `true`) */
	readonly allowSlash: boolean = true;
	/** Whether the command should be runned using chat messages with prefix. (default `true`) */
	readonly allowMessage: boolean = true;
	/** Whether the command could also be executed in Direct Messages. (default `false`) */
	readonly DMAllowed: boolean = false;
	/** Whether the command should work only on NSFW channels. (default `false`) */
	readonly isNSFW: boolean = false;

	get slash(): SlashCommandBuilder | null {
		if (!this.allowSlash || !this._slash) return null;
		return this._slash;
	}
	get name(): string {
		return this._name;
	}
	get nameLocalizations(): LanguagesStringMap | null {
		return this._nameLocalizations || null;
	}
	get nameLocalizationsList(): string[] {
		return Object.values(this.nameLocalizations || {});
	}
	get aliases(): string[] {
		return this._aliases || [];
	}
	get description(): string {
		return this._description.trim();
	}
	get descriptionLocalizations(): LanguagesStringMap | null {
		return this._descriptionLocalizations || null;
	}
	get guilds(): string[] {
		return this._guilds || [];
	}
	get options(): ClientCommandOption<false>[] | null {
		return this._options || null;
	}
	get subcommands(): ClientSubCommand[] | null {
		return this._subcommands || null;
	}
	get chatMessageOptionsIndex(): string[] {
		return this._chatMessageOptionsIndex || [];
	}
	get whitelist(): ClientCommandPermission | null {
		return this._whitelist || null;
	}
	get blacklist(): Omit<ClientCommandPermission, "permissions"> | null {
		return this._blacklist || null;
	}

	get usageString(): string {
		if (this.options && this.chatMessageOptionsIndex.length > 0) {
			const requiredOptions = this.options
				.filter((o: ClientCommandOption<false>) => o.required)
				.map((o: ClientCommandOption<false>) => o.name);
			return this.chatMessageOptionsIndex
				.map((n: string) => `<${n}${!requiredOptions.includes(n) ? "?" : ""}>`)
				.join(" ");
		}
		return "";
	}

	readonly execute?: (
		origin: ClientCommandInteractionOrigin | ClientCommandMessageOrigin,
		options: {
			[key: string]:
				| DefinedClientCommandOption[keyof typeof TypesEnum]
				| undefined;
		}
	) => Awaitable<any>;

	constructor(builder: ClientCommandBuilder) {
		if (typeof builder.name !== "string" || builder.name.trim().length === 0)
			throw new SyntaxError("Invalid commmand name");
		if (
			typeof builder.description !== "string" ||
			builder.description.trim().length === 0
		)
			throw new SyntaxError("Invalid command description");

		this._name = builder.name.trim().toLowerCase();
		this._nameLocalizations =
			parseLocalizations(builder.nameLocalizations) || undefined;
		this._description = builder.description.trim();
		this._descriptionLocalizations =
			parseLocalizations(builder.descriptionLocalizations) || undefined;

		if (builder.allowMessage === false) this.allowMessage = false;
		if (builder.allowSlash === false) this.allowSlash = false;
		if (builder.DMAllowed === true) this.DMAllowed = true;
		if (builder.isNSFW === true) this.isNSFW = true;

		if (Array.isArray(builder.aliases))
			this._aliases = builder.aliases
				.filter((a) => typeof a === "string" && a.trim().length > 0)
				.map((a) => a.trim().toLowerCase());

		if (builder.guilds) {
			if (!Array.isArray(builder.guilds))
				throw new SyntaxError("Command 'guilds' must be a Guild IDs Array");
			this._guilds = builder.guilds.filter(
				(g) => typeof g === "string" && /\d+/.test(g)
			);
		}

		if (
			builder.whitelist?.permissions &&
			!Array.isArray(builder.whitelist?.permissions)
		)
			throw new SyntaxError(
				"Whitelist Permissions must be a PermissionFlags Array"
			);
		if (builder.whitelist?.users && !Array.isArray(builder.whitelist.users))
			throw new SyntaxError("Whitelist Users must be a User IDs Array");
		if (builder.whitelist?.roles && !Array.isArray(builder.whitelist.roles))
			throw new SyntaxError("Whitelist Roles must be a Role IDs Array");
		if (builder.blacklist?.users && !Array.isArray(builder.blacklist.users))
			throw new SyntaxError("Blacklist Users must be a User IDs Array");
		if (builder.blacklist?.roles && !Array.isArray(builder.blacklist.roles))
			throw new SyntaxError("Blacklist Roles must be a Role IDs Array");

		if (builder.whitelist) {
			const filteredWhitelistPermissions =
				builder.whitelist.permissions?.filter((p) => p in PermissionFlagsBits);
			this._whitelist = {
				permissions: filteredWhitelistPermissions
					? filteredWhitelistPermissions.reduce(
							(a, b) => a + PermissionFlagsBits[b],
							0n
					  )
					: null,
				users:
					builder.whitelist.users?.filter(
						(u) => typeof u === "string" && /\d+/.test(u)
					) || null,
				roles:
					builder.whitelist.roles?.filter(
						(r) => (typeof r === "string" && r.length > 0) || /\d+/.test(r)
					) || null,
			};
		}
		if (builder.blacklist)
			this._blacklist = {
				users:
					builder.blacklist.users?.filter(
						(u) => typeof u === "string" && /\d+/.test(u)
					) || null,
				roles:
					builder.blacklist.roles?.filter(
						(r) => (typeof r === "string" && r.length > 0) || /\d+/.test(r)
					) || null,
			};

		if (this.allowSlash) {
			this._slash = new SlashCommandBuilder()
				.setName(this.name)
				.setDescription(this.description)
				.setNameLocalizations(this.nameLocalizations)
				.setDescriptionLocalizations(this.descriptionLocalizations)
				.setDMPermission(this.DMAllowed)
				.setNSFW(this.isNSFW);

			if (this.whitelist?.permissions)
				this._slash.setDefaultMemberPermissions(this.whitelist.permissions);
		}

		if ("onExecute" in builder && !("subcommands" in builder)) {
			if (typeof builder.onExecute !== "function")
				throw new SyntaxError("Command 'onExecute' must be a Function");
			this.execute = builder.onExecute;
		}

		if ("subcommands" in builder && builder.subcommands) {
			if (!Array.isArray(builder.subcommands))
				throw new SyntaxError("Command subcommands must be an Array");

			this._subcommands = builder.subcommands.map((sub) =>
				parseSubcommand(sub, true)
			);

			if (this._slash) {
				for (const subcommand of this._subcommands) {
					if ("groupCommands" in subcommand && subcommand.groupCommands) {
						this._slash.addSubcommandGroup((subgroup) => {
							subgroup
								.setName(subcommand.name)
								.setNameLocalizations(subcommand.nameLocalizations)
								.setDescription(subcommand.description)
								.setDescriptionLocalizations(
									subcommand.descriptionLocalizations
								);

							for (const internalcommand of subcommand.groupCommands || [])
								subgroup.addSubcommand((input) =>
									addSubcommand(internalcommand, input)
								);

							return subgroup;
						});
					} else if (!("groupCommands" in subcommand))
						this._slash.addSubcommand((input) =>
							addSubcommand(subcommand, input)
						);
				}

				function addSubcommand(
					subcommand: ClientSingleSubCommand,
					input: SlashCommandSubcommandBuilder
				): SlashCommandSubcommandBuilder {
					input
						.setName(subcommand.name)
						.setNameLocalizations(subcommand.nameLocalizations)
						.setDescription(subcommand.description)
						.setDescriptionLocalizations(subcommand.descriptionLocalizations);

					if (subcommand.options) addClientOptions(input, subcommand.options);

					return input;
				}
			}

			this.execute = undefined;
			this._options = undefined;
			this._chatMessageOptionsIndex = undefined;
		} else if ("options" in builder && builder.options) {
			if (!Array.isArray(builder.options))
				throw new SyntaxError("Command options must be an Array");

			this._options = builder.options.map(parseOption);
			if (this.allowMessage && builder.chatMessageOptionsIndex)
				this._chatMessageOptionsIndex = parseChatMessageOptions(
					this._options,
					builder.chatMessageOptionsIndex
				);

			if (this._slash) addClientOptions(this._slash, this._options);

			this._subcommands = undefined;
		}
	}
}
