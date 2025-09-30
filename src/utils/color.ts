export function isHex(s: string): boolean {
	return /^#([0-9A-F]{3}|[0-9A-F]{6})$/.test(s);
}

export function normalizeHex (s: string): string {
	let x = s.trim();
	if(!x.startsWith("#")) x = "#" + x;
	return x.toUpperCase();
}
