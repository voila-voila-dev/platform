import * as React from "react";
import {
	NativeSelect,
	NativeSelectOptGroup,
	NativeSelectOption,
} from "#/components/ui/native-select.tsx";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select.tsx";
import { useIsMobile } from "#/hooks/use-mobile.ts";

// A composable select with two surfaces from one declaration: the Base UI
// `Select` popup on desktop and the OS-native `<select>` under the `useIsMobile`
// breakpoint (768px), where the native picker is the better touch experience.
//
// The parts (`Trigger`, `Value`, `Content`, `Group`, `Label`, `Item`) map 1:1
// to the underlying `Select` parts on desktop. A native `<select>` is monolithic
// — it can't be split into a trigger and a portalled popup — so on mobile the
// `Root` reads the part *elements* (their props, not their rendered output) and
// projects them onto a single `NativeSelect`. That keeps desktop usage identical
// to using `Select` directly while still yielding a real native control on phones.
//
// Because the projection inspects element types, the parts must be DIRECT
// children of their parent part (`Trigger` > `Value`, `Content` > `Item`/`Group`,
// `Group` > `Label`/`Item`). Fragments and `.map()` are fine; wrapper elements
// (e.g. a `<div>` around items) are not — they'd hide the items from the scan.
// Item/Label content must be plain text so a native `<option>` can render it.

type ItemProps = {
	value: string;
	disabled?: boolean;
	children?: React.ReactNode;
};

function getElementsOfType<Props>(
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

function getElementOfType<Props>(
	children: React.ReactNode,
	type: React.ElementType,
): React.ReactElement<Props> | undefined {
	return getElementsOfType<Props>(children, type)[0];
}

/** Flatten a text-only node to a string for native `<option>`/`<optgroup>` labels. */
function textOf(node: React.ReactNode): string {
	if (typeof node === "string") return node;
	if (typeof node === "number") return String(node);
	if (Array.isArray(node)) return node.map(textOf).join("");
	return "";
}

export type ResponsiveSelectRootProps = {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	/** Submitted under this name (hidden input on desktop, the `<select>` on mobile). */
	name?: string;
	disabled?: boolean;
	required?: boolean;
	children?: React.ReactNode;
};

/** Desktop `value → label` map so the Base UI trigger renders the selected label. */
function buildItemsRecord(children: React.ReactNode): Record<string, string> {
	const content = getElementOfType<{ children?: React.ReactNode }>(
		children,
		ResponsiveSelectContent,
	);
	const record: Record<string, string> = {};
	const visit = (nodes: React.ReactNode) => {
		for (const child of React.Children.toArray(nodes)) {
			if (!React.isValidElement(child)) continue;
			if (child.type === ResponsiveSelectItem) {
				const props = child.props as ItemProps;
				record[props.value] = textOf(props.children);
			} else if (child.type === ResponsiveSelectGroup) {
				visit((child.props as { children?: React.ReactNode }).children);
			}
		}
	};
	if (content) visit(content.props.children);
	return record;
}

function NativeOptionsFromContent({ children }: { children: React.ReactNode }) {
	return (
		<>
			{React.Children.map(children, (child) => {
				if (!React.isValidElement(child)) return null;
				if (child.type === ResponsiveSelectItem) {
					const props = child.props as ItemProps;
					return (
						<NativeSelectOption value={props.value} disabled={props.disabled}>
							{props.children}
						</NativeSelectOption>
					);
				}
				if (child.type === ResponsiveSelectGroup) {
					const groupChildren = (child.props as { children?: React.ReactNode })
						.children;
					const label = getElementOfType<{ children?: React.ReactNode }>(
						groupChildren,
						ResponsiveSelectLabel,
					);
					const items = getElementsOfType<ItemProps>(
						groupChildren,
						ResponsiveSelectItem,
					);
					return (
						<NativeSelectOptGroup label={textOf(label?.props.children)}>
							{items.map((item) => (
								<NativeSelectOption
									key={item.props.value}
									value={item.props.value}
									disabled={item.props.disabled}
								>
									{item.props.children}
								</NativeSelectOption>
							))}
						</NativeSelectOptGroup>
					);
				}
				return null;
			})}
		</>
	);
}

function ResponsiveSelectRoot({
	value,
	defaultValue,
	onValueChange,
	name,
	disabled,
	required,
	children,
}: ResponsiveSelectRootProps) {
	// Single source of truth for which surface renders: the native `<select>`
	// below 768px, the Base UI popup above it.
	const isMobile = useIsMobile();

	if (!isMobile) {
		return (
			<Select
				items={buildItemsRecord(children)}
				value={value}
				defaultValue={defaultValue}
				onValueChange={
					onValueChange
						? (next) => {
								// Base UI resets a single select to `null` when its controlled
								// value no longer matches any item (e.g. the chosen item is
								// removed from the list right after selection). The public
								// contract here is string-only, so swallow that reset instead
								// of leaking `null` to consumers.
								if (typeof next === "string") onValueChange(next);
							}
						: undefined
				}
				name={name}
				disabled={disabled}
				required={required}
			>
				{children}
			</Select>
		);
	}

	// Project the part elements onto one native control. The Select parts below
	// are never instantiated on this surface — we only read their props.
	const trigger = getElementOfType<ResponsiveSelectTriggerProps>(
		children,
		ResponsiveSelectTrigger,
	);
	const content = getElementOfType<{ children?: React.ReactNode }>(
		children,
		ResponsiveSelectContent,
	);
	const triggerProps = trigger?.props ?? {};
	const placeholder = trigger
		? getElementOfType<{ placeholder?: string }>(
				triggerProps.children,
				ResponsiveSelectValue,
			)?.props.placeholder
		: undefined;

	return (
		<NativeSelect
			id={triggerProps.id}
			// Base UI allows a state-function className on the trigger; only a plain
			// string is meaningful on a native <select>, so drop the function form.
			className={
				typeof triggerProps.className === "string"
					? triggerProps.className
					: undefined
			}
			size={triggerProps.size}
			aria-invalid={triggerProps["aria-invalid"]}
			aria-label={triggerProps["aria-label"]}
			aria-labelledby={triggerProps["aria-labelledby"]}
			// The trigger types blur against a button; the projected target is a
			// <select>, but the handler only reads currentTarget/relatedTarget.
			onBlur={
				triggerProps.onBlur as
					| React.FocusEventHandler<HTMLSelectElement>
					| undefined
			}
			value={value}
			defaultValue={defaultValue}
			onChange={
				onValueChange ? (event) => onValueChange(event.target.value) : undefined
			}
			name={name}
			disabled={disabled}
			required={required}
		>
			{placeholder !== undefined && (
				<NativeSelectOption value="">{placeholder}</NativeSelectOption>
			)}
			<NativeOptionsFromContent>
				{content?.props.children}
			</NativeOptionsFromContent>
		</NativeSelect>
	);
}

type ResponsiveSelectTriggerProps = React.ComponentProps<typeof SelectTrigger>;

// On desktop these render their Base UI counterpart; on mobile `Root` reads them
// instead of rendering them, so they double as the declaration the native
// `<select>` is built from.
function ResponsiveSelectTrigger(props: ResponsiveSelectTriggerProps) {
	return <SelectTrigger {...props} />;
}

function ResponsiveSelectValue(
	props: React.ComponentProps<typeof SelectValue>,
) {
	return <SelectValue {...props} />;
}

function ResponsiveSelectContent(
	props: React.ComponentProps<typeof SelectContent>,
) {
	return <SelectContent {...props} />;
}

function ResponsiveSelectGroup(
	props: React.ComponentProps<typeof SelectGroup>,
) {
	return <SelectGroup {...props} />;
}

function ResponsiveSelectLabel(
	props: React.ComponentProps<typeof SelectLabel>,
) {
	return <SelectLabel {...props} />;
}

function ResponsiveSelectItem(props: React.ComponentProps<typeof SelectItem>) {
	return <SelectItem {...props} />;
}

export const ResponsiveSelect = {
	Root: ResponsiveSelectRoot,
	Trigger: ResponsiveSelectTrigger,
	Value: ResponsiveSelectValue,
	Content: ResponsiveSelectContent,
	Group: ResponsiveSelectGroup,
	Label: ResponsiveSelectLabel,
	Item: ResponsiveSelectItem,
};
