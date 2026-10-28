import {
	ArrowLeftIcon,
	ArrowRightIcon,
	PlusIcon,
	TrashIcon,
} from "@phosphor-icons/react";
import { NodeApi, type Path } from "platejs";
import {
	PlateElement,
	type PlateElementProps,
	useEditorRef,
} from "platejs/react";
import { Button } from "#/button/components/button.tsx";
import { useContentEditorLabels } from "#/content-editor/context/content-editor-context.tsx";
import { useContentEditorTheme } from "#/content-editor/context/theme-context.ts";
import {
	COLUMNS_DESKTOP_COUNTS,
	type ContentColumnsNode,
	columnsGridClassName,
	columnsGridStyle,
	freshColumn,
} from "#/content-editor/features/columns/reader.tsx";
import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type { ContentElementViewProps } from "#/content-editor/lib/define-element-feature.ts";
import { cn } from "#/lib/utils.ts";

/**
 * The row on the canvas: the old grid block's layout, with the theme's gap.
 * The columns are laid out by the width the row gets, so a phone, or a
 * narrow side panel, shows the mobile count.
 */
export function ColumnsView({
	node,
	children,
}: ContentElementViewProps<ContentColumnsNode>) {
	const theme = useContentEditorTheme();
	return (
		<div className="@container">
			<div
				data-slot="content-editor-columns"
				className={cn(
					columnsGridClassName,
					// The canvas spaces sibling blocks apart; columns sit side by side.
					"*:mt-0!",
				)}
				style={columnsGridStyle(node, theme.gridGapPx)}
			>
				{children}
			</div>
		</div>
	);
}

/** One column: a faint outline, so the author sees where it ends. */
export function ColumnElement(props: PlateElementProps) {
	return (
		<PlateElement
			{...props}
			className="min-w-0 rounded-sm px-1.5 py-1 outline-1 outline-border outline-dashed"
		/>
	);
}

const columnText = (column: ContentNodeLike): string =>
	(column.children ?? [])
		.map((block) => NodeApi.string(block as never).trim())
		.filter((text) => text !== "")
		.join(" ");

/**
 * Under the counts, the columns themselves: each named by its first words,
 * moved left or right, removed; and a column added at the end. The count
 * and the columns change in one step, so the normalizer never has to guess.
 */
export function ColumnsInspector({
	node,
}: {
	readonly node: ContentColumnsNode;
}) {
	const editor = useEditorRef();
	const { chrome } = useContentEditorLabels();
	const columns = node.children;
	const count = columns.length;
	const max = COLUMNS_DESKTOP_COUNTS[COLUMNS_DESKTOP_COUNTS.length - 1] ?? 4;

	const pathOf = (): Path | undefined =>
		typeof node.id === "string"
			? editor.api.node({ at: [], match: { id: node.id } })?.[1]
			: editor.api.findPath(node as never);

	const change = (apply: (path: Path) => void) => {
		const path = pathOf();
		if (path !== undefined) {
			editor.tf.withoutNormalizing(() => apply(path));
		}
	};

	const add = () =>
		change((path) => {
			editor.tf.insertNodes(freshColumn() as never, {
				at: path.concat(count),
			});
			editor.tf.setNodes({ desktopColumns: count + 1 } as never, { at: path });
		});

	const remove = (index: number) =>
		change((path) => {
			editor.tf.removeNodes({ at: path.concat(index) });
			editor.tf.setNodes({ desktopColumns: count - 1 } as never, { at: path });
		});

	const move = (index: number, to: number) =>
		change((path) => {
			editor.tf.moveNodes({ at: path.concat(index), to: path.concat(to) });
		});

	return (
		<div className="flex flex-col gap-1.5">
			<ol className="flex flex-col gap-1">
				{columns.map((column, index) => {
					const position = index + 1;
					const text = columnText(column as ContentNodeLike);
					return (
						<li
							// A column has no identity of its own the author sees; its
							// id when stored with one.
							key={String((column as { id?: string }).id ?? index)}
							className="flex items-center gap-1"
						>
							<span className="flex min-w-0 flex-1 flex-col text-sm">
								<span className="font-medium">
									{chrome.columnsColumn(position)}
								</span>
								<span className="truncate text-muted-foreground text-xs">
									{text === "" ? chrome.columnsEmpty : text}
								</span>
							</span>
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								aria-label={chrome.columnsMoveBefore(position)}
								disabled={index === 0}
								onClick={() => move(index, index - 1)}
							>
								<ArrowLeftIcon aria-hidden />
							</Button>
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								aria-label={chrome.columnsMoveAfter(position)}
								disabled={index === count - 1}
								onClick={() => move(index, index + 1)}
							>
								<ArrowRightIcon aria-hidden />
							</Button>
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								aria-label={chrome.columnsRemove(position)}
								disabled={count === 1}
								onClick={() => remove(index)}
							>
								<TrashIcon aria-hidden />
							</Button>
						</li>
					);
				})}
			</ol>
			<Button
				type="button"
				variant="outline"
				size="sm"
				className="self-start"
				disabled={count >= max}
				onClick={add}
			>
				<PlusIcon aria-hidden />
				{chrome.columnsAdd}
			</Button>
		</div>
	);
}
