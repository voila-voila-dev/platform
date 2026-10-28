import * as React from "react";
import { useIsMobile } from "#/hooks/use-mobile.ts";
import { NativeSelect } from "#/native-select/components/native-select.tsx";
import { NativeOptionsFromContent } from "#/responsive-select/components/native-options-from-content.tsx";
import type { SelectItemShape } from "#/responsive-select/components/responsive-select-children.ts";
import {
	getElementOfType,
	textOf,
} from "#/responsive-select/components/responsive-select-children.ts";
import { ResponsiveSelectContent } from "#/responsive-select/components/responsive-select-content.tsx";
import { ResponsiveSelectGroup } from "#/responsive-select/components/responsive-select-group.tsx";
import { ResponsiveSelectItem } from "#/responsive-select/components/responsive-select-item.tsx";
import { ResponsiveSelectTrigger } from "#/responsive-select/components/responsive-select-trigger.tsx";
import { ResponsiveSelectValue } from "#/responsive-select/components/responsive-select-value.tsx";
import { Select } from "#/select/components/select.tsx";

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
				const props = child.props as SelectItemShape;
				record[props.value] = textOf(props.children);
			} else if (child.type === ResponsiveSelectGroup) {
				visit((child.props as { children?: React.ReactNode }).children);
			}
		}
	};
	if (content) visit(content.props.children);
	return record;
}

// Item/Label content must be plain text so a native `<option>` can render it.
interface Props {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	/** Submitted under this name (hidden input on desktop, the `<select>` on mobile). */
	name?: string;
	disabled?: boolean;
	required?: boolean;
	children?: React.ReactNode;
}

export function ResponsiveSelectRoot({
	value,
	defaultValue,
	onValueChange,
	name,
	disabled,
	required,
	children,
}: Props) {
	// Single source of truth for which surface renders: the native `<select>`
	// below 768px, the Base UI popup above it.
	const isMobile = useIsMobile();

	if (!isMobile) {
		return (
			<Select.Root
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
			</Select.Root>
		);
	}

	// Project the part elements onto one native control. The Select parts below
	// are never instantiated on this surface — we only read their props.
	const trigger = getElementOfType<
		React.ComponentProps<typeof ResponsiveSelectTrigger>
	>(children, ResponsiveSelectTrigger);
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
		<NativeSelect.Root
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
				<NativeSelect.Option value="">{placeholder}</NativeSelect.Option>
			)}
			<NativeOptionsFromContent>
				{content?.props.children}
			</NativeOptionsFromContent>
		</NativeSelect.Root>
	);
}
