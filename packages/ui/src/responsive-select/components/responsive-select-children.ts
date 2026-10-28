import * as React from "react";

// The mobile half projects the part *elements* onto one native control, so it
// reads their props rather than rendering them. These helpers do that scan.
//
// Because the projection inspects element types, the parts must be DIRECT
// children of their parent part (`Trigger` > `Value`, `Content` > `Item`/`Group`,
// `Group` > `Label`/`Item`). Fragments and `.map()` are fine; wrapper elements
// (e.g. a `<div>` around items) are not — they'd hide the items from the scan.

export type SelectItemShape = {
	value: string;
	disabled?: boolean;
	children?: React.ReactNode;
};

export function getElementsOfType<Props>(
	children: React.ReactNode,
	type: React.ElementType,
): Array<React.ReactElement<Props>> {
	const result: Array<React.ReactElement<Props>> = [];
	for (const child of React.Children.toArray(children)) {
		if (React.isValidElement(child) && child.type === type) {
			result.push(child as React.ReactElement<Props>);
		}
	}
	return result;
}

export function getElementOfType<Props>(
	children: React.ReactNode,
	type: React.ElementType,
): React.ReactElement<Props> | undefined {
	return getElementsOfType<Props>(children, type)[0];
}

/** Flatten a text-only node to a string for native `<option>`/`<optgroup>` labels. */
export function textOf(node: React.ReactNode): string {
	if (typeof node === "string") return node;
	if (typeof node === "number") return String(node);
	if (Array.isArray(node)) return node.map(textOf).join("");
	return "";
}
