import { config as _envConfig } from "dotenv";
import { basename, resolve } from "path";
import { existsSync } from "fs";

/**
 * Load environment file based on NODE_ENV.
 * The precedence is:
 *  - .env.local (when NODE_ENV === 'local')
 *  - .env.production (when NODE_ENV === 'production')
 *  - .env.development (otherwise)
 * Falls back to a plain .env when the chosen file is missing.
 */
const envType = process.env.NODE_ENV;
const dynamicEnvFile = resolve(
	process.cwd(),
	envType === "local"
		? "./.env.local"
		: envType === "production"
		? "./.env.production"
		: "./.env.development"
);
const envPath = existsSync(dynamicEnvFile)
	? dynamicEnvFile
	: resolve(process.cwd(), "./.env");

if (!existsSync(envPath)) throw new Error("Can't find .env file");

console.log(`Loading env "${basename(envPath)}"`);

_envConfig({ path: envPath });
