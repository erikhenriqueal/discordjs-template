<div align="center">
	<br />
	<h1>Discord.Js Template</h1>
	<p>
		<a href="https://discord.js.org/" target="_blank"><img alt="Discord.Js" src="https://img.shields.io/badge/discord.js-14.25.1-5765F1?logo=discord&logoColor=white">
		</a>
		<a href="https://www.typescriptlang.org/" target="_blank"><img alt="Made with TypeScript" src="https://img.shields.io/badge/Made_with-TypeScript-3178C6?logo=typescript&logoColor=white">
		</a>
		<img alt="Version 2.1.0" src="https://img.shields.io/badge/Version-2.0.1-blue">
		<p><i>With ❤️, by <a href="https://github.com/erikhenriqueal">Erik Lima</a></i></p>
	</p>
</div>

---

<br />
<br />

# Features

## [Classes](./src/classes)
>
> [ClientCommand](./src/classes/ClientCommand.ts)
>
> - Supports both Chat Message and Discord's Slash commands simultaneously.
> - Function Based listeners to handle Commands/Subcommands executions, Options usage and Autocompletes.
>
> [ClientCommandOrigin](./src/classes/ClientCommandOrigin.ts)
>
> - Helper class for [ClientCommand](./src/classes/ClientCommand.ts) to handle both Interaction-based and Message-based commands.
>
> [ClientEvent](./src/classes/ClientEvent.ts)
>
> - Implemented class of interface [ClientEvents](https://discord.js.org/docs/packages/discord.js/main/ClientEventTypes:Interface) to build events with additional methods.
>
## [Commands](./src/commands)
>
> This path is made to handle all your [ClientCommands](./src/classes/ClientCommand.ts). The file [commands.ts](./src/commands.ts) is responsible to automatically handle the commands in this path.
>
## [Events](./src/events)
>
> Made for you to create your [ClientEvents](./src/classes/ClientEvent.ts), this path is read by [events.ts](./src/events.ts) to listen to all your events.
>
## [Handlers](./src/handlers)
>
> Includes simple functions to help with handling events and commands.
>
## [Utils](./src/utils)
>
> Includes some utilities functions to manipulate and validate different types of data and structures, including [Environment Variables](./.env.template) configuration.

<br />

# Client Settings
>
> You can use [clientConfig.json](./clientConfig.json) to define some custom settings for your client.
> Additionally, you can use [clientConfig.ts](./src/utils/clientConfig.ts) to manipulate this file using code.

<br />

# Usage
>
> This tamplate was made on Windows, but you can change the scripts in [package.json](./package.json) to fit for your OS.
>
## DevMode

You can run you application in developing mode using this command:

```bash
npm run dev
```

But... You can also use this for clear you client application commands before running in dev mode:

```bash
npm run clear-dev
```

## Production Mode

```bash
npm run build
npm start
```

Running `start` will automatically build your TypeScript code before running it. After it, the commands are automatically cleared. You can change this behavior in [package.json](./package.json).

## Scripts

- `setup`: Quick setup the project.
- `build`: Build the project for production.
- `commit`: Usage `npm run commit -m "Commit message"`. Automatically commits your code to your repository (`git push -u origin main` by default).
- `start`: Start the app for production (prioritizes `.env.production`, then clears Slash Commands when ended up).
- `dev`: Run the app in Dev Mode. (prioritizes `.env.development`).
- `dev-in-local`: Run the app in Dev Mode (prioritizes `.env.local`).
- `dev-in-prod`: Run the app in Dev Mode (prioritizes `.env.production`).
- `clear-slash-commands`: Clear Slash Commands (prioritizes `.env.production`).
- `clear-slash-commands-dev`: Clear Slash Commands (prioritizes `.env.development`).
- `clear-dev`: Clears Slash Commands then run in Dev Mode (prioritizes `.env.development`)
- `test`: Runs `./test.ts` in Dev Mode.
- `test-local`: Runs `./test.ts` in Local Mode.

# Next Features
>
> - Create Stated Messages (messages that automatically updates when some of these variables are changed)
> - Add Interface Context Menu Commands
> - Implement Interactions (like Buttons, Selection menu, etc.)
