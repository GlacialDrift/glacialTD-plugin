import MyPlugin from "../main";
import {Notice} from "obsidian";


export function registerHelloCommand(plugin: MyPlugin) {
	plugin.addCommand({
		id: 'hello-world',
		name: 'Hello World',
		callback: () => new Notice('Hello, World!!'),
	});
}
