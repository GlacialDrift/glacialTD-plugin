import MyPlugin from "../main";
import {Editor, MarkdownView} from "obsidian";


export function registerSampleEditorCommand(plugin: MyPlugin) {
	plugin.addCommand({
		id: 'sample-editor-command',
		name: 'Sample editor command',
		editorCallback: (editor: Editor, _view: MarkdownView) => {
			console.log(editor.getSelection());
			editor.replaceSelection('Sample Editor Command');
		},
	});
}
