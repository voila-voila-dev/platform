import type { Icon } from "@phosphor-icons/react";
import { CaretDownIcon } from "@phosphor-icons/react";
import { useEditorSelector } from "platejs/react";
import { Button } from "#/button/components/button.tsx";
import { MenuEntry } from "#/content-editor/components/toolbar-item.tsx";
import { useContentEditorConfig } from "#/content-editor/context/content-editor-context.tsx";
import type { ContentToolbarItem } from "#/content-editor/features/feature-definition.tsx";
import { DropdownMenu } from "#/dropdown-menu/components/dropdown-menu.tsx";
import { cn } from "#/lib/utils.ts";

interface Props {
	items: ReadonlyArray<ContentToolbarItem>;
	/**
	 * What the trigger shows. `"active"` mirrors the item active at the
	 * selection (the block type); a label with an icon names the menu itself.
	 */
	trigger: "active" | { readonly label: string; readonly icon: Icon };
	className?: string;
}

/**
 * A run of related items folded into one menu, so the toolbar shows a
 * choice where a row of toggles would show every option at once.
 */
export function ContentEditorToolbarMenu({ items, trigger, className }: Props) {
	const { labels, readOnly } = useContentEditorConfig();
	const active = useEditorSelector(
		(current) =>
			trigger === "active"
				? (items.find((item) => item.isActive?.(current)) ?? items[0])
				: undefined,
		[items, trigger],
	);
	const shown =
		trigger === "active"
			? active === undefined
				? undefined
				: {
						label: labels.items[active.label] ?? active.label,
						icon: active.icon,
					}
			: trigger;
	if (shown === undefined) {
		return null;
	}
	const Icon = shown.icon;
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				render={
					<Button
						variant="ghost"
						size="sm"
						aria-label={shown.label}
						disabled={readOnly}
						onMouseDown={(event) => event.preventDefault()}
						className={cn("gap-1.5 px-2", className)}
					/>
				}
			>
				<Icon />
				<span className="max-sm:sr-only">{shown.label}</span>
				<CaretDownIcon className="size-3 opacity-60" />
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="start">
				{items.map((item) => (
					<MenuEntry key={item.key} item={item} />
				))}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}
ContentEditorToolbarMenu.slot = "toolbar" as const;
