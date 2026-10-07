/** Elements named by a selector, a list or a single element. */
export function resolveElements(
	target: Element | string | readonly Element[],
): readonly Element[] {
	if (typeof target === "string") {
		return typeof document === "undefined"
			? []
			: Array.from(document.querySelectorAll(target));
	}
	return "length" in target ? target : [target as Element];
}
