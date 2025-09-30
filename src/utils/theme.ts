import type {ThemeMode} from "../settings/types";

export function getThemeMode(): ThemeMode {
	return document.body.classList.contains("theme-dark")? "dark" : "light";
}
