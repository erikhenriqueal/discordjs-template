import {
	Message as DiscordMessage,
	ChatInputCommandInteraction as DiscordChatInputCommandInteraction,
	CacheType as DiscordCacheType,
} from "discord.js";

/**
 * Enhanced types for command origins so handlers can treat both message and interaction
 * origins with a common API (`isInteraction()`, `isMessage()`, etc.).
 */
export interface ClientCommandInteractionOrigin<
	Cached extends DiscordCacheType = DiscordCacheType
> extends DiscordChatInputCommandInteraction<Cached> {
	isInteraction(): this is ClientCommandInteractionOrigin<DiscordCacheType>;
	isMessage(): this is ClientCommandMessageOrigin;
	inGuild(): this is ClientCommandInteractionOrigin<"raw" | "cached">;
	inCachedGuild(): this is ClientCommandInteractionOrigin<"cached">;
	inRawGuild(): this is ClientCommandInteractionOrigin<"raw">;
	isChatInputCommand(): this is ClientCommandInteractionOrigin<Cached>;
	isRepliable(): this is ClientCommandInteractionOrigin<Cached>;
}

export interface ClientCommandMessageOrigin<InGuild extends boolean = boolean>
	extends DiscordMessage<InGuild> {
	isInteraction(): this is ClientCommandInteractionOrigin<DiscordCacheType>;
	isMessage(): this is ClientCommandMessageOrigin;
	inGuild(): this is ClientCommandMessageOrigin<true>;
}

/**
 * Augment the provided `origin` (interaction or message) with helper type-guards
 * used across command handlers.
 */
const ClientCommandOriginBuilder = (
	origin: DiscordChatInputCommandInteraction | DiscordMessage
): ClientCommandInteractionOrigin | ClientCommandMessageOrigin => {
	if (origin instanceof DiscordChatInputCommandInteraction) {
		return Object.assign(origin, {
			isInteraction() {
				return true;
			},
			isMessage() {
				return false;
			},
		}) as ClientCommandInteractionOrigin;
	} else if (origin instanceof DiscordMessage) {
		return Object.assign(origin, {
			isInteraction() {
				return false;
			},
			isMessage() {
				return true;
			},
		}) as ClientCommandMessageOrigin;
	}
	throw new TypeError(
		"Origin must be an instance of Discord.Message or Discord.ChatInputCommandInteraction"
	);
};

export default ClientCommandOriginBuilder;
