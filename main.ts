import {App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TextComponent} from 'obsidian';

// Remember to rename these classes and interfaces!

interface GTDLPSettings {
	tagCollector: string;
	metaKeys: string[];
	overdueBackgroundColor: string;
	overdueFontColor: string;
	overdueFontWeight: number;
	dueTodayBackgroundColor: string;
	dueTodayFontColor: string;
	dueTodayFontWeight: number;
}

const DEFAULT_SETTINGS: GTDLPSettings = {
	tagCollector: '#todo',
	metaKeys: ['due','priority','topic','completion'],
	overdueBackgroundColor: '#351b1b',
	overdueFontColor: '#ff6b6b',
	overdueFontWeight: 600,
	dueTodayBackgroundColor: '#565424',
	dueTodayFontColor: '#ffffff',
	dueTodayFontWeight: 600
}

export default class MyPlugin extends Plugin {
	settings: GTDLPSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.

		const ribbonIconEl = this.addRibbonIcon('list-checks', 'ToDo List Plugin', (_evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');


		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('ToDo-List is Running');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});

		this.addCommand({
			id: 'hello-world',
			name: 'Hello World',
			callback: () => {
				new Notice('Hello, World!!');
			}
		});


		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, _view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new GTDLPSettingsTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class GTDLPSettingsTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", { text: "Glacial ToDo List — Settings" });

		// tagCollector (simple text)
		new Setting(containerEl)
			.setName("Tag collector")
			.setDesc("The tag that marks items to collect (e.g., #todo).")
			.addText((txt) =>
				txt
					.setPlaceholder("#todo")
					.setValue(this.plugin.settings.tagCollector)
					.onChange(async (v) => {
						this.plugin.settings.tagCollector = v.trim();
						await this.plugin.saveSettings();
					})
			);

		// metaKeys (CSV text area -> string[])
		new Setting(containerEl)
			.setName("Metadata keys")
			.setDesc("Comma-separated in-line metadata keys that should be parsed by the To-Do List (e.g., due, priority, topic, completion).")
			.addTextArea((ta) =>
				ta
					.setPlaceholder("due, priority, topic, completion")
					.setValue(this.plugin.settings.metaKeys.join(", "))
					.onChange(async (v) => {
						this.plugin.settings.metaKeys = this.parseCsv(v);
						await this.plugin.saveSettings();
					})
			);

		// Colors (use color pickers)
		new Setting(containerEl)
			.setName("Overdue Task Background Color")
			.addColorPicker((cp) =>
				cp.setValue(this.plugin.settings.overdueBackgroundColor).onChange(async (v) => {
					this.plugin.settings.overdueBackgroundColor = v;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Overdue Task Font Color")
			.addColorPicker((cp) =>
				cp.setValue(this.plugin.settings.overdueFontColor).onChange(async (v) => {
					this.plugin.settings.overdueFontColor = v;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Tasks Due Today Background Color")
			.addColorPicker((cp) =>
				cp.setValue(this.plugin.settings.dueTodayBackgroundColor).onChange(async (v) => {
					this.plugin.settings.dueTodayBackgroundColor = v;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Tasks Due Today Font Color")
			.addColorPicker((cp) =>
				cp.setValue(this.plugin.settings.dueTodayFontColor).onChange(async (v) => {
					this.plugin.settings.dueTodayFontColor = v;
					await this.plugin.saveSettings();
				})
			);

		// Font weights (100–900 in steps of 100)
		new Setting(containerEl)
			.setName("Overdue Task Font Weight")
			.setDesc("Font Weight from 100 to 900")
			.addSlider((sl) =>
				sl
					.setLimits(100, 900, 100)
					.setValue(this.plugin.settings.overdueFontWeight)
					.setDynamicTooltip()
					.onChange(async (v) => {
						this.plugin.settings.overdueFontWeight = v;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Tasks Due Today Font Weight")
			.setDesc("Font Weight from 100 to 900")
			.addSlider((sl) =>
				sl.setLimits(100, 900, 100)
					.setValue(this.plugin.settings.dueTodayFontWeight)
					.setDynamicTooltip()
					.onChange(async (v) => {
						this.plugin.settings.dueTodayFontWeight = v;
						await this.plugin.saveSettings();
					})
			);

	}

	// ----- 4) tiny helpers -----
	parseCsv(input: string): string[] {
		return input
			.split(",")
			.map((s) => s.trim())
			.filter((s) => s.length > 0);
	}
}


