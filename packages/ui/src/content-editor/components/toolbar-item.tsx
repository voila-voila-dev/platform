import { useEditorRef, useEditorSelector } from "platejs/react";
import { type ReactElement, useState } from "react";
import { Button } from "#/button/components/button.tsx";
import { useContentEditorConfig } from "#/content-editor/context/content-editor-context.tsx";
import type { ContentToolbarItem } from "#/content-editor/features/feature-definition.tsx";
import { DropdownMenu } from "#/dropdown-menu/components/dropdown-menu.tsx";
import { Kbd } from "#/kbd/components/kbd.tsx";
import { Popover } from "#/popover/components/popover.tsx";
import { Toggle } from "#/toggle/components/toggle.tsx";
import { Tooltip } from "#/tooltip/components/tooltip.tsx";

interface Props {
	item: ContentToolbarItem;
	/** Smaller chrome for the floating toolbar. */
	size?: "default" | "sm";
}

/** One entry of an item's menu, with its own state read from the editor. */
export function MenuEntry({ item }: { readonly item: ContentToolbarItem }) {
	const editor = useEditorRef();
	const { labels, uploadImage, readOnly } = useContentEditorConfig();
	const state = useEditorSelector(
		(current) => ({
			active: item.isActive?.(current) ?? false,
			disabled: readOnly || (item.isDisabled?.(current) ?? false),
			visible: item.isVisible?.(current) ?? true,
		}),
		[item, readOnly],
	);
	if (!state.visible) {
		return null;
	}
	const Icon = item.icon;
	return (
		<DropdownMenu.Item
			disabled={state.disabled}
			aria-pressed={item.isActive !== undefined ? state.active : undefined}
			onClick={() => item.run(editor, { labels, uploadImage })}
		>
			<Icon />
			{labels.items[item.label] ?? item.label}
		</DropdownMenu.Item>
	);
}

/**
 * One registry item as a control: a Toggle when the item knows whether it
 * is active, a Button otherwise, a Popover trigger when it opens a form, a
 * menu trigger when it opens a menu. `onMouseDown` is swallowed so the
 * editor keeps its selection while the control is pressed.
 */
export function ContentEditorToolbarItem({ item, size = "default" }: Props) {
	const editor = useEditorRef();
	const { labels, uploadImage, readOnly } = useContentEditorConfig();
	const [open, setOpen] = useState(false);
	const state = useEditorSelector(
		(current) => ({
			active: item.isActive?.(current) ?? false,
			disabled: readOnly || (item.isDisabled?.(current) ?? false),
			visible: item.isVisible?.(current) ?? true,
		}),
		[item, readOnly],
	);
	if (!state.visible) {
		return null;
	}
	const label = labels.items[item.label] ?? item.label;
	const Icon = item.icon;
	const opensSomething = item.Popover !== undefined || item.menu !== undefined;
	const control =
		item.isActive !== undefined ? (
			<Toggle
				aria-label={label}
				size={size === "sm" ? "sm" : "default"}
				pressed={state.active}
				disabled={state.disabled}
				onMouseDown={(event) => event.preventDefault()}
				onPressedChange={() => {
					if (!opensSomething) {
						item.run(editor, { labels, uploadImage });
					}
				}}
			>
				<Icon />
			</Toggle>
		) : (
			<Button
				variant="ghost"
				size={size === "sm" ? "icon-xs" : "icon-sm"}
				aria-label={label}
				disabled={state.disabled}
				onMouseDown={(event) => event.preventDefault()}
				onClick={() => {
					if (!opensSomething) {
						item.run(editor, { labels, uploadImage });
					}
				}}
			>
				<Icon />
			</Button>
		);
	// The tooltip wraps whatever opens on the control, so a menu's or a
	// popover's trigger props land on the button itself and not on a
	// component that renders no DOM.
	const withTooltip = (trigger: ReactElement) => (
		<Tooltip.Root>
			<Tooltip.Trigger render={trigger} />
			<Tooltip.Content>
				{label}
				{item.kbd ? (
					<Kbd.Group>
						{item.kbd.map((key) => (
							<Kbd.Root key={key} size="sm">
								{key}
							</Kbd.Root>
						))}
					</Kbd.Group>
				) : null}
			</Tooltip.Content>
		</Tooltip.Root>
	);
	if (item.menu !== undefined) {
		return (
			<DropdownMenu.Root>
				{withTooltip(<DropdownMenu.Trigger render={control} />)}
				<DropdownMenu.Content align="start">
					{item.menu.map((entry) => (
						<MenuEntry key={entry.key} item={entry} />
					))}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		);
	}
	if (item.Popover === undefined) {
		return withTooltip(control);
	}
	const Form = item.Popover;
	return (
		<Popover.Root open={open} onOpenChange={setOpen}>
			{withTooltip(<Popover.Trigger render={control} />)}
			<Popover.Content
				side="bottom"
				align="start"
				className="w-[min(18rem,calc(100vw-2rem))] p-3"
			>
				{open ? <Form onClose={() => setOpen(false)} /> : null}
			</Popover.Content>
		</Popover.Root>
	);
}
