import {
	Children,
	createContext,
	isValidElement,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
} from "react";
import { cn } from "#/lib/utils.ts";

/** How a part tells the layout it is there, so a layout missing its canvas warns. */
const ContentEditorLayoutContext = createContext<
	((part: string) => void) | null
>(null);

export function useRegisterContentEditorPart(part: string): void {
	const register = useContext(ContentEditorLayoutContext);
	useEffect(() => {
		register?.(part);
	}, [register, part]);
}

/**
 * Where a part sits. Declared as a static on the component rather than as a
 * class on its root, so two parts never share a cell without saying so.
 */
export type ContentEditorSlot = "toolbar" | "main" | "status";

export interface ContentEditorPart {
	readonly slot?: ContentEditorSlot;
}

function slotOf(child: ReactNode): ContentEditorSlot {
	if (!isValidElement(child)) {
		return "main";
	}
	return (child.type as ContentEditorPart)?.slot ?? "main";
}

interface Props {
	className?: string;
	/** Keeps the toolbar row visible while the document scrolls under it. */
	stickyToolbar?: boolean;
	children: ReactNode;
}

/**
 * The toolbar above the document, the status line under it, in source order
 * within each row. A part without a slot lands in the main column.
 */
export function ContentEditorLayout({
	className,
	stickyToolbar = false,
	children,
}: Props) {
	const parts = useRef(new Set<string>());
	const register = useCallback((part: string) => {
		parts.current.add(part);
	}, []);

	useEffect(() => {
		if (!parts.current.has("canvas")) {
			console.warn(
				"<ContentEditor.Layout /> has no <ContentEditor.Canvas /> inside it: the document has nowhere to show.",
			);
		}
	}, []);

	const rows = Children.toArray(children).reduce<
		Record<ContentEditorSlot, ReactNode[]>
	>(
		(grouped, child) => {
			grouped[slotOf(child)].push(child);
			return grouped;
		},
		{ toolbar: [], main: [], status: [] },
	);

	return (
		<ContentEditorLayoutContext.Provider value={register}>
			<div
				data-slot="content-editor-layout"
				className={cn("flex flex-col gap-2", className)}
			>
				{rows.toolbar.length > 0 ? (
					<div
						data-slot="content-editor-layout-toolbar"
						className={cn(
							"flex flex-wrap items-center gap-1",
							stickyToolbar &&
								"sticky top-0 z-10 bg-background/95 py-1 backdrop-blur",
						)}
					>
						{rows.toolbar}
					</div>
				) : null}
				<div
					data-slot="content-editor-layout-main"
					className="flex min-w-0 flex-col gap-2"
				>
					{rows.main}
				</div>
				{rows.status.length > 0 ? (
					<div
						data-slot="content-editor-layout-status"
						className="flex items-center justify-end gap-3 text-muted-foreground text-xs"
					>
						{rows.status}
					</div>
				) : null}
			</div>
		</ContentEditorLayoutContext.Provider>
	);
}
