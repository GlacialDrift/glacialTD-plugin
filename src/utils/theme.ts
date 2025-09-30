import type {ModeColors, ThemeMode} from "../settings/types";

export function getThemeMode(): ThemeMode {
	return document.body.classList.contains("theme-dark")? "dark" : "light";
}

export function cssVar(name: string, fallback?: string): string {
	const v = getComputedStyle(document.body).getPropertyValue(name).trim();
	return v || (fallback ?? ' ');
}

export function toHex(color: string, fallback: string): string {
	const el = document.createElement("div");
	el.style.color = color;
	document.body.appendChild(el);
	const cs = getComputedStyle(el).color;
	document.body.removeChild(el);

	const m = cs.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
	if (!m) return fallback;
	const r = Number(m[1]), g = Number(m[2]), b = Number(m[3]);
	const hex = (n: number) => n.toString(16).padStart(2, "0").toUpperCase();
	return `#${hex(r)}${hex(g)}${hex(b)}`;
}

export function readableText(bgHex: string): string {
	// YIQ contrast heuristic
	const r = parseInt(bgHex.slice(1, 3), 16);
	const g = parseInt(bgHex.slice(3, 5), 16);
	const b = parseInt(bgHex.slice(5, 7), 16);
	const yiq = (r * 299 + g * 587 + b * 114) / 1000;
	return yiq >= 160 ? '#000000' : '#FFFFFF';
}

export function deriveThemeColors(): ModeColors {

	const overdueBgRaw =
		cssVar('--color-red') ||
		cssVar('--background-modifier-error') ||
		'#fb464c';

	const dueTodayBgRaw =
		cssVar('--color-yellow') ||
		cssVar('--background-modifier-warning') ||
		'#e0de71';

	const overdueBackgroundColor = toHex(overdueBgRaw, '#fb464c');
	const dueTodayBackgroundColor = toHex(dueTodayBgRaw, '#e0de71');

	const overdueFontColor = readableText(overdueBackgroundColor);
	const dueTodayFontColor = readableText(dueTodayBackgroundColor);

	return {
		overdueBackgroundColor,
		overdueFontColor,
		dueTodayBackgroundColor,
		dueTodayFontColor,
	};
}
