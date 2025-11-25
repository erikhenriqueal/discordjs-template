import fs from "fs";
import path from "path";
import ClientCommand from "./classes/ClientCommand";

const commandsPath = path.join(__dirname, "/commands");
if (!fs.existsSync(commandsPath) || !fs.statSync(commandsPath).isDirectory())
	throw new Error(`Commands folder '${commandsPath}' not found`);

export function importCommands(
	commandsPath: string,
	recursive?: true
): ClientCommand[] {
	console.log('Executing importCommands from "src/commands.ts"');
	const commands: ClientCommand[] = [];

	const commandsFiles = fs.readdirSync(commandsPath, { encoding: "utf-8" });
	for (const file of commandsFiles) {
		const commandPath = path.join(commandsPath, file);
		if (fs.statSync(commandPath).isDirectory() && recursive === true)
			commands.push(...importCommands(commandPath));
		else if (fs.statSync(commandPath).isFile()) {
			try {
				const imported = require(commandPath);
				const command = "default" in imported ? imported.default : imported;
				if (!(command instanceof ClientCommand))
					throw new Error("Command is not a valid ClientCommand");

				commands.push(command);
			} catch (e) {
				console.error(`Failed to import command from '${commandPath}'`);
				throw e;
			}
		}
	}

	return commands;
}

const commands = importCommands(commandsPath, true);
export default commands;
