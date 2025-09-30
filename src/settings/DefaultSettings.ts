import {GTDLPSettings} from "./types";

export const DEFAULT_SETTINGS: Partial<GTDLPSettings> = {
	tagCollector: '#todo',
	metaKeys: ['due','priority','topic','completion'],
	fontReset: true,
	followThemeColors: true,
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
