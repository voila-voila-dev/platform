import * as React from "react";

/** Mirrors the latest value onto a ref so callbacks stay referentially stable. */
export function useLatest<T>(value: T) {
	const ref = React.useRef(value);

	ref.current = value;

	return ref;
}
