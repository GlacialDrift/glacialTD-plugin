import MyPlugin from "../main";
import {registerHelloCommand} from "./hello";
import {registerSampleEditorCommand} from "./sampleEditor";
import {registerOpenSampleModalCommands} from "./openSampleModal";


export function registerAllCommands(plugin: MyPlugin) {
	registerHelloCommand(plugin);
	registerSampleEditorCommand(plugin);
	registerOpenSampleModalCommands(plugin);
}
