import {
	useComboboxInput,
	useHTMLInputCursorState,
} from "@platejs/combobox/react";
import {
	PlateElement,
	type PlateElementProps,
	useEditorRef,
} from "platejs/react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Command } from "#/command/components/command.tsx";
import { useContentEditorConfig } from "#/content-editor/context/content-editor-context.tsx";
import type { ContentSlashItem } from "#/content-editor/features/feature-definition.tsx";
import type { ContentEditorLabels } from "#/content-editor/labels.ts";

function filterSlashItems(
	items: ReadonlyArray<ContentSlashItem>,
	labels: ContentEditorLabels,
	query: string,
): ReadonlyArray<ContentSlashItem> {
	const needle = query.trim().toLowerCase();
	if (needle === "") {
		return items;
	}
	return items.filter(
		(item) =>
			(labels.items[item.label] ?? item.label).toLowerCase().includes(needle) ||
			item.keywords.some((keyword) => keyword.toLowerCase().includes(needle)),
	);
}

/**
 * The inline element Plate inserts when the user types `/`. The `<input>`
 * is ours; `useComboboxInput` owns the cancel-on-blur / escape / arrow
 * lifecycle. The list is the registry's slash items, filtered here rather
 * than by cmdk, so a host's labels are what the filter matches on.
 */
export function SlashInputElement(props: PlateElementProps) {
	const editor = useEditorRef();
	const { registry, capabilities, labels, uploadImage } =
		useContentEditorConfig();
	const inputRef = useRef<HTMLInputElement>(null);
	const [query, setQuery] = useState("");
	const [highlighted, setHighlighted] = useState(0);

	const cursorState = useHTMLInputCursorState(inputRef);
	const { props: comboboxProps, removeInput } = useComboboxInput({
		ref: inputRef,
		cursorState,
	});

	// Rendered into document.body under the input: inside the inline element
	// the list would be clipped by the canvas and squeezed by the line box.
	const [anchor, setAnchor] = useState<{ top: number; left: number } | null>(
		null,
	);
	useLayoutEffect(() => {
		const rect = inputRef.current?.getBoundingClientRect();
		if (rect !== undefined) {
			setAnchor({ top: rect.bottom + 4, left: rect.left - 8 });
		}
	}, [query]);

	const items = useMemo(
		() => filterSlashItems(registry.slashItems(capabilities), labels, query),
		[registry, capabilities, labels, query],
	);
	const highlight = Math.min(highlighted, Math.max(items.length - 1, 0));

	const apply = (item: ContentSlashItem) => {
		removeInput(true);
		// Deferred so the slash_input node is gone before the item acts on
		// the paragraph around it.
		setTimeout(() => item.run(editor, { labels, uploadImage }), 0);
	};

	return (
		<PlateElement
			{...props}
			as="span"
			className="relative inline-block align-baseline"
		>
			<span contentEditable={false} className="inline-flex items-baseline">
				<span className="text-muted-foreground">/</span>
				<input
					ref={inputRef}
					value={query}
					onChange={(event) => {
						setQuery(event.target.value);
						setHighlighted(0);
					}}
					onBlur={comboboxProps.onBlur}
					onKeyDown={(event) => {
						if (event.key === "ArrowDown") {
							event.preventDefault();
							setHighlighted((current) =>
								Math.min(current + 1, Math.max(items.length - 1, 0)),
							);
							return;
						}
						if (event.key === "ArrowUp") {
							event.preventDefault();
							setHighlighted((current) => Math.max(current - 1, 0));
							return;
						}
						if (event.key === "Enter" || event.key === "Tab") {
							const item = items[highlight];
							if (item !== undefined) {
								event.preventDefault();
								apply(item);
								return;
							}
						}
						comboboxProps.onKeyDown(event);
					}}
					placeholder={labels.chrome.slashPlaceholder}
					aria-label={labels.chrome.insert}
					className="min-w-[8ch] bg-transparent text-sm outline-none"
				/>
				{anchor === null
					? null
					: createPortal(
							<Command.Root
								data-slot="content-editor-slash-menu"
								shouldFilter={false}
								value={items[highlight]?.key ?? ""}
								onValueChange={(key) => {
									const index = items.findIndex((item) => item.key === key);
									if (index >= 0) {
										setHighlighted(index);
									}
								}}
								style={{
									position: "fixed",
									top: anchor?.top,
									left: anchor?.left,
									zIndex: 50,
								}}
								className="h-auto w-56 rounded-md border border-border shadow-md"
							>
								<Command.List>
									{items.length === 0 ? (
										<Command.Empty>{labels.chrome.slashEmpty}</Command.Empty>
									) : null}
									{items.map((item) => {
										const Icon = item.icon;
										return (
											<Command.Item
												key={item.key}
												value={item.key}
												onMouseDown={(event) => event.preventDefault()}
												onSelect={() => apply(item)}
											>
												<Icon />
												{labels.items[item.label] ?? item.label}
											</Command.Item>
										);
									})}
								</Command.List>
							</Command.Root>,
							document.body,
						)}
			</span>
			{props.children}
		</PlateElement>
	);
}
