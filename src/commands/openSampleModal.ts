import {SampleModal} from "../ui/sampleModal";
import MyPlugin from "../main";
import {MarkdownView} from "obsidian";


export function registerOpenSampleModalCommands(plugin: MyPlugin) {
	// Simple
	plugin.addCommand({
		id: 'open-sample-modal-simple',
		name: 'Open sample modal (simple)',
		callback: () => new SampleModal(plugin.app).open(),
	});

	// Complex (checkCallback)
	plugin.addCommand({
		id: 'open-sample-modal-complex',
		name: 'Open sample modal (complex)',
		checkCallback: (checking: boolean) => {
			const markdownView = plugin.app.workspace.getActiveViewOfType(MarkdownView);
			if (markdownView) {
				if (!checking) new SampleModal(plugin.app).open();
				return true;
			}
		},
	});
}
