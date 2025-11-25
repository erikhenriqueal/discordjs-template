/**
 * List of privileged intents in Discord.js until 24th November 2025
 */
export const PrivilegedIntents = [
	"GuildPresences",
	"MessageContent",
	"GuildMembers",
];

export const snowflakeIdBase = "\\d{17,20}";
export const SNOWFLAKE_ID_REGEXP = new RegExp(`^${snowflakeIdBase}$`);
export const CHANNEL_STRING_REGEXP = new RegExp(`^<#${snowflakeIdBase}>$`);
export const ROLE_STRING_REGEXP = new RegExp(`^<@&${snowflakeIdBase}>$`);
export const USER_STRING_REGEXP = new RegExp(`^<@!?${snowflakeIdBase}>$`);

export function validateSnowflakeId(snowflakeString: string): boolean {
	return SNOWFLAKE_ID_REGEXP.test(snowflakeString);
}
export function validateChannelString(
	channelString: string,
	allowIdOnly?: boolean
): boolean {
	return (
		CHANNEL_STRING_REGEXP.test(channelString) ||
		(allowIdOnly && SNOWFLAKE_ID_REGEXP.test(channelString))
	);
}
export function validateRoleString(
	roleString: string,
	allowIdOnly?: boolean
): boolean {
	return (
		ROLE_STRING_REGEXP.test(roleString) ||
		(allowIdOnly && SNOWFLAKE_ID_REGEXP.test(roleString))
	);
}
export function validateUserString(
	userString: string,
	allowIdOnly?: boolean
): boolean {
	return (
		USER_STRING_REGEXP.test(userString) ||
		(allowIdOnly && SNOWFLAKE_ID_REGEXP.test(userString))
	);
}
