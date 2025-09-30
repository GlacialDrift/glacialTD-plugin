

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
	fontReset: boolean;
	followThemeColors: boolean;
	colors: {
		dark: ModeColors;
		light: ModeColors;
	}
	overdueFontWeight: number;
	dueTodayFontWeight: number;
}
