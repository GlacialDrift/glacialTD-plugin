import {App, PluginSettingTab, Setting} from "obsidian";
import MyPlugin from "../main";
import {colorRow} from "../ui/colorRow";


export class GTDLPSettingsTab extends PluginSettingTab {
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
