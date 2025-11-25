import { Client } from "discord.js";
import { getClientConfig } from "../utils/clientConfig";
import { randomint } from "../utils/number";
import { handleSlashCommands } from "../handlers/commandsHandler";
import ClientEvent from "../classes/ClientEvent";

function replaceActivitiesVariables(
	input: string,
	client: Client<true>
): string {
	if (typeof input !== "string" || !(client instanceof Client)) return input;

	const variables = {
		"client-username": client.user.username,
		"client-id": client.user.id,
	};

	return input.replace(
		new RegExp(`{(${Object.keys(variables).join("|")})}`, "g"),
		(substr) => variables[substr.slice(1, -1) as keyof typeof variables]
	);
}
export function rotateActivities(client: Client<true>, time?: number) {
	let activitiesRotationInterval: number =
		time ?? getClientConfig("rotate_activities_interval") ?? 5e3;

	setTimeout(() => {
		if (!time)
			activitiesRotationInterval =
				getClientConfig("rotate_activities_interval") ?? 5e3;

		const allowAutoActivities: boolean | undefined =
			getClientConfig("rotate_activities");
		if (allowAutoActivities === false) return;

		const activities = getClientConfig("activities");
		if (!Array.isArray(activities) || activities.length == 0)
			return client.user.setActivity();

		try {
			const activity = activities[randomint(0, activities.length - 1)];
			if (activity.name)
				activity.name = replaceActivitiesVariables(activity.name, client);
			if (activity.state)
				activity.state = replaceActivitiesVariables(activity.state, client);
			if (activity.url)
				activity.url = replaceActivitiesVariables(activity.url, client);

			client.user.setActivity(activity);
		} catch (e) {}

		return rotateActivities(client, time);
	}, activitiesRotationInterval);
}

const clientReady = new ClientEvent("clientReady", true).setListener(
	async (client) => {
		clientReady.log(`Hey, I'm ${client.user.username}!`);

		rotateActivities(client);
		await handleSlashCommands(client);
	}
);

export default clientReady;
