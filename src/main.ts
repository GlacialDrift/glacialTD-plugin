import {
	App,
	ColorComponent,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	TextComponent
} from 'obsidian';

// Remember to rename these classes and interfaces!

type ThemeMode = 'dark' | 'light';

interface ModeColors {
	overdueBackgroundColor: string;
	overdueFontColor: string;
	dueTodayBackgroundColor: string;
	dueTodayFontColor: string;
}

interface GTDLPSettings {
	tagCollector: string;
	metaKeys: string[];
	colors: {
		dark: ModeColors;
		light: ModeColors;
	}
	overdueFontWeight: number;
	dueTodayFontWeight: number;
}

const DEFAULT_SETTINGS: GTDLPSettings = {
	tagCollector: '#todo',
	metaKeys: ['due','priority','topic','completion'],
	colors: {
		dark: {
			overdueBackgroundColor: '#6F1B1B',
			overdueFontColor: '#ff6b6b',
			dueTodayBackgroundColor: '#969454',
			dueTodayFontColor: '#ffffff'
		},
		light: {
			overdueBackgroundColor: '#ff6b6b',
			overdueFontColor: '#000000',
			dueTodayBackgroundColor: '#ffff80',
			dueTodayFontColor: '#000000'
		}
	},
	overdueFontWeight: 600,
	dueTodayFontWeight: 600
}

export default class MyPlugin extends Plugin {
	settings: GTDLPSettings;
	currentMode: ThemeMode = 'dark';
	settingsTab?: GTDLPSettingsTab;

	async onload() {
		await this.loadSettings();
		this.currentMode = getThemeMode();

		// Re-render settings when user switches Appearance
		this.registerEvent(
			this.app.workspace.on("css-change", () => {
				const next = getThemeMode();
				if (next !== this.currentMode) {
					this.currentMode = next;
					this.settingsTab?.display?.(); // updates the visible 4 controls
				}
			})
		);

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.settingsTab = new GTDLPSettingsTab(this.app, this);
		this.addSettingTab(this.settingsTab);

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

	get activeColors(): ModeColors {
		return this.settings.colors[this.currentMode];
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

		const mode = this.plugin.currentMode;
		const colors = this.plugin.activeColors;

		containerEl.createEl("h1", { text: "Glacial ToDo List — Settings" });
		containerEl.createEl("h2", { text: "Behavior Settings"});

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

		containerEl.createEl("h2", { text: "Appearance Settings"});
		containerEl.createEl("div", {
			text: `Editing: ${mode.toUpperCase()} mode colors. To edit the other set, change Appearance (Light/Dark) in Obsidian.`,
			cls: "setting-item-description",
		});

		// Colors (use color pickers)
		colorRow(containerEl, "Overdue background",
			() => colors.overdueBackgroundColor,
			async (hex) => { colors.overdueBackgroundColor = hex; await this.plugin.saveSettings(); }
		);

		colorRow(containerEl, "Overdue font color",
			() => colors.overdueFontColor,
			async (hex) => { colors.overdueFontColor = hex; await this.plugin.saveSettings(); }
		);

		colorRow(containerEl, "Due today background",
			() => colors.dueTodayBackgroundColor,
			async (hex) => { colors.dueTodayBackgroundColor = hex; await this.plugin.saveSettings(); }
		);

		colorRow(containerEl, "Due today font color",
			() => colors.dueTodayFontColor,
			async (hex) => { colors.dueTodayFontColor = hex; await this.plugin.saveSettings(); }
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

function getThemeMode(): ThemeMode {
	return document.body.classList.contains("theme-dark")? "dark" : "light";
}

function isHex(s: string): boolean {
	return /^#([0-9A-F]{3}|[0-9A-F]{6})$/.test(s);
}

function normalizeHex (s: string): string {
	let x = s.trim();
	if(!x.startsWith("#")) x = "#" + x;
	return x.toUpperCase();
}

function colorRow (
	containerEl: HTMLElement,
	label: string,
	get: () => string,
	set: (hex: string) => Promise<void>) {

	let txt!: TextComponent;
	let cp!: ColorComponent;

	new Setting(containerEl)
		.setName(label)
		.addText((t) => {
			txt = t;
			t.setValue(get().toUpperCase())
				.onChange(async (val) => {
					const hex = normalizeHex(val);
					if (isHex(hex)) {
						await set(hex);
						cp.setValue(hex);
					}
				});
			t.inputEl.style.width = "100px";
		})
		.addColorPicker((c) => {
			cp = c;
			c.setValue(get()).onChange(async (v) => {
				const hex = normalizeHex(v);
				if (isHex(hex)) {
					txt.setValue(hex);
					await set(hex);
				} else {
					new Notice("Invalid color (use #RGB or #RRGGBB)");
				}
			});
		});
}
