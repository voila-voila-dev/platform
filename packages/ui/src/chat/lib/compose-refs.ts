import type * as React from "react";

/** Compose several refs into one callback ref (upstream's use-render helper). */
export function composeRefs<T>(
	...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> | undefined {
	const validRefs = refs.filter(Boolean);

	if (validRefs.length === 0) {
		return undefined;
	}

	return (value) => {
		for (const ref of validRefs) {
			if (typeof ref === "function") {
				ref(value);
			} else if (ref) {
				ref.current = value;
			}
		}
	};
}
