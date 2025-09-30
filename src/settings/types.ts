

export type ThemeMode = 'dark' | 'light';

export interface ModeColors {
	overdueBackgroundColor: string;
	overdueFontColor: string;
	dueTodayBackgroundColor: string;
	dueTodayFontColor: string;
}

export interface GTDLPSettings {
	tagCollector: string;
	metaKeys: string[];
	colors: {
		dark: ModeColors;
		light: ModeColors;
	}
	overdueFontWeight: number;
	dueTodayFontWeight: number;
}

export const DEFAULT_SETTINGS: Partial<GTDLPSettings> = {
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
