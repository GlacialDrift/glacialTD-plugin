// AI-written function to deep merge two json objects. The intention is that the target may have some parameters
// that don't exist in the source. We don't want to overwrite the existence of those parameters by just cloning
// and using the source. Instead, deep merge the source onto the target so that extra target properties are preserved.
export function deepMerge<T>(target: T, source: Partial<T>): T {
	if (source == null) return target;
	for (const [k, v] of Object.entries(source as Record<string, unknown>)) {
		const key = k as keyof T;
		if (Array.isArray(v)) {
			// replace arrays from source (simple, predictable)
			(target as any)[key] = v.slice();
		} else if (v && typeof v === "object") {
			if (typeof (target as any)[key] !== "object" || (target as any)[key] == null) {
				(target as any)[key] = {};
			}
			deepMerge((target as any)[key], v as any);
		} else {
			(target as any)[key] = v as any;
		}
	}
	return target;
}
