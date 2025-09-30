import {ColorComponent, Notice, Setting, TextComponent} from "obsidian";
import {isHex, normalizeHex} from "../utils/color";


export function colorRow (
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
