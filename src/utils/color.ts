export function isHex(s: string): boolean {
	return /^#([0-9A-F]{3}|[0-9A-F]{6})$/.test(s);
}

export function normalizeHex (s: string): string {
	let x = s.trim();
	if(!x.startsWith("#")) x = "#" + x;
	return x.toUpperCase();
}

function hexToRgb(hex: string): {r: number, g: number, b: number } {
	const h = hex.replace('#', '');
	const v = h.length === 3 ?
		h.split('').map( (c) => c+c).join('') :
		h;
	const r = parseInt(v.slice(0,2), 16);
	const g = parseInt(v.slice(2,4), 16);
	const b = parseInt(v.slice(4,6), 16);
	return {r, g, b};
}

function srgbToLinear(c: number): number {
	const cs = c/255;
	return cs <= 0.04045 ? cs/12.92 : Math.pow((cs+0.055)/1.055, 2.4);
}

function relativeLuminance(hex: string): number {
	const {r,g,b} = hexToRgb(hex);
	const R = srgbToLinear(r);
	const G = srgbToLinear(g);
	const B = srgbToLinear(b);
	return 0.2126*R + 0.7152*G + 0.0722*B;
}

export function contrastRatio(bgHex: string, fgHex: string): number{
	const L1 = relativeLuminance(bgHex);
	const L2 = relativeLuminance(fgHex);
	const light = Math.max(L1,L2);
	const dark = Math.min(L1, L2);
	return (light+0.05) / (dark + 0.05);
}

export function bestOn(bgHex: string): '#000000' | '#ffffff' {
	const cBlack = contrastRatio(bgHex, '#000000');
	const cWhite = contrastRatio(bgHex, '#ffffff');
	return cBlack >= cWhite ? '#000000' : '#ffffff';
}
export function meetsContrast(bgHex: string, fgHex: string, threshold = 4.5): boolean {
	return contrastRatio(bgHex, fgHex) >= threshold;
}
