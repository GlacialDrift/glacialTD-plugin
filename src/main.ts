import {
	Notice,
	Plugin,
} from 'obsidian';
import {GTDLPSettings, ModeColors, ThemeMode} from "./settings/types";
import {GTDLPSettingsTab} from "./settings/SettingsTab";
import {deriveThemeColors, getThemeMode} from "./utils/theme";
import {deepMerge} from "./utils/merge";
import {registerAllCommands} from "./commands";
import {DEFAULT_SETTINGS} from "./settings/DefaultSettings";

// Remember to rename these classes and interfaces!

export default class MyPlugin extends Plugin {
	settings!: GTDLPSettings;
	currentMode!: ThemeMode;
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

		registerAllCommands(this);

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {}

	async loadSettings() {
		const loaded = await this.loadData(); // returns parsed JSON or null
		// deep clone defaults (works in modern Electron/Node; Obsidian’s fine)
		const base = structuredClone(DEFAULT_SETTINGS);
		this.settings = deepMerge(base, loaded ?? {});
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	get activeColors(): ModeColors {
		if (this.settings.followThemeColors) {
			return deriveThemeColors();                 // live theme values
		}
		return this.settings.colors[this.currentMode]; // your saved values
	}

}
