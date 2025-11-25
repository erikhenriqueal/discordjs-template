import EventEmitter from "events";
import { extname } from "path";
import { existsSync, statSync, watchFile, writeFileSync } from "fs";
import { resolveJSON } from "./useJSON";

export interface ConfigOptions {
	path?: string;
	watch?: boolean;
}

export default class Config<T> extends EventEmitter {
	private _path: string;

	private _checkPath() {
		if (!existsSync(this._path))
			throw new Error(`Can't find '${this._path}' file`);

		if (extname(this._path) !== ".json")
			throw new Error(`Path isn't a JSON file.`);
	}

	changePath(newPath: string) {
		if (!existsSync(newPath))
			throw new Error(`Path '${newPath}' doesn't exists`);
		if (!statSync(newPath).isFile() || extname(newPath) !== ".json")
			throw new Error(`Path '${newPath}' must be a JSON file`);
		this._path = newPath;
	}

	get(key?: string): any {
		this._checkPath();

		return resolveJSON(this._path, (cfg) => {
			if (!cfg) return null;
			if (!key) return cfg;
			else return cfg[key];
		});
	}

	update(newData: T): boolean {
		this._checkPath();

		return resolveJSON<T>(this._path, (data) => {
			if (!data) return false;
			if (Object.getPrototypeOf(data) !== Object.prototype) return false;

			const newConfig = {
				...data,
				...newData,
			};

			try {
				writeFileSync(this._path, JSON.stringify(newConfig, null, 2), {
					encoding: "utf-8",
				});
				return true;
			} catch (e) {
				return false;
			}
		});
	}

	constructor(path: string, options?: ConfigOptions) {
		if (typeof path !== "string")
			throw new SyntaxError("[ useConfig ] You must define a valid path.");

		super();

		this._path = path;
		this._checkPath();
		if (options.watch)
			watchFile(this._path, () => {
				console.log(`[ useConfig ] Reloaded '${this._path}'`);
			});
	}
}
