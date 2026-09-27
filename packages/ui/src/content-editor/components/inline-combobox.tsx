import type { Icon } from "@phosphor-icons/react";
import type { CancelComboboxInputCause } from "@platejs/combobox";
import {
	useComboboxInput,
	useHTMLInputCursorState,
} from "@platejs/combobox/react";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Command } from "#/command/components/command.tsx";

export interface InlineComboboxItem {
	readonly key: string;
	readonly label: string;
	readonly icon?: Icon;
}

interface Props {
	readonly plate: PlateElementProps;
	/** What the author typed to open it, shown before the query. */
	readonly trigger: string;
	/** The items matching the query, in the order they are offered. */
	readonly filter: (query: string) => ReadonlyArray<InlineComboboxItem>;
	/** Called once the input is gone from the document. */
	readonly onPick: (key: string) => void;
	readonly onCancel?: (cause: CancelComboboxInputCause, query: string) => void;
	readonly placeholder: string;
	readonly ariaLabel: string;
	readonly empty: string;
	readonly listSlot: string;
}

/**
 * The input Plate inserts when a trigger is typed (`/`, `{{`), and the list
 * under it. The `<input>` is ours; `useComboboxInput` owns the cancel on
 * blur, Escape and arrow keys. The caller filters, so what matches is the
 * host's labels, not cmdk's guess.
 */
export function InlineCombobox({
	plate,
	trigger,
	filter,
	onPick,
	onCancel,
	placeholder,
	ariaLabel,
	empty,
	listSlot,
}: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [query, setQuery] = useState("");
	const [highlighted, setHighlighted] = useState(0);

	const cursorState = useHTMLInputCursorState(inputRef);
	const { props: comboboxProps, removeInput } = useComboboxInput({
		ref: inputRef,
		cursorState,
		onCancelInput: (cause) => onCancel?.(cause, query),
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

	const items = useMemo(() => filter(query), [filter, query]);
	const highlight = Math.min(highlighted, Math.max(items.length - 1, 0));

	const pick = (item: InlineComboboxItem) => {
		removeInput(true);
		onPick(item.key);
	};

	return (
		<PlateElement
			{...plate}
			as="span"
			className="relative inline-block align-baseline"
		>
			<span contentEditable={false} className="inline-flex items-baseline">
				<span className="text-muted-foreground">{trigger}</span>
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
								pick(item);
								return;
							}
						}
						comboboxProps.onKeyDown(event);
					}}
					placeholder={placeholder}
					aria-label={ariaLabel}
					className="min-w-[8ch] bg-transparent text-sm outline-none"
				/>
				{anchor === null
					? null
					: createPortal(
							<Command.Root
								data-slot={listSlot}
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
									top: anchor.top,
									left: anchor.left,
									zIndex: 50,
								}}
								className="h-auto w-56 rounded-md border border-border shadow-md"
							>
								<Command.List>
									{items.length === 0 ? (
										<Command.Empty>{empty}</Command.Empty>
									) : null}
									{items.map((item) => {
										const ItemIcon = item.icon;
										return (
											<Command.Item
												key={item.key}
												value={item.key}
												onMouseDown={(event) => event.preventDefault()}
												onSelect={() => pick(item)}
											>
												{ItemIcon === undefined ? null : <ItemIcon />}
												{item.label}
											</Command.Item>
										);
									})}
								</Command.List>
							</Command.Root>,
							document.body,
						)}
			</span>
			{plate.children}
		</PlateElement>
	);
}
