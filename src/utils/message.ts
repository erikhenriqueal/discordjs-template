import { Locale } from "discord.js";

export type MultilanguageMessages = {
	[key in Locale]?: string;
};
export function localizedText(
	localizations: MultilanguageMessages,
	lang?: Locale
): string | undefined {
	if (lang && lang in localizations) return localizations[lang];
	return undefined;
}
