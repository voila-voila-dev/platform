import * as React from "react";
import { useEmailEditorState } from "#/email-block-editor/context/email-editor-context.tsx";
import { cn } from "#/lib/utils.ts";

/** How a part tells the layout it is there. Composition makes it possible to
 * forget the canvas entirely and still get a working, empty editor. */
const EmailEditorLayoutContext = React.createContext<
	((part: string) => void) | null
>(null);

/** Called by a part a `Layout` should not be missing. */
export const useRegisterEmailEditorPart = (part: string): void => {
	const register = React.useContext(EmailEditorLayoutContext);
	React.useEffect(() => {
		register?.(part);
	}, [register, part]);
};

/**
 * Which column a part belongs to on a wide viewport. Declared as a static on
 * the component rather than as a class on its root, because two parts placed
 * into the same CSS grid cell overlap silently — they render on top of each
 * other and the one underneath is simply invisible.
 */
export type EmailEditorSlot = "main" | "side";

export interface EmailEditorPart {
	readonly slot?: EmailEditorSlot;
}

const slotOf = (child: React.ReactNode): EmailEditorSlot => {
	if (!React.isValidElement(child)) {
		return "main";
	}
	return (child.type as EmailEditorPart)?.slot ?? "main";
};

interface Props {
	className?: string;
	children: React.ReactNode;
}

/**
 * The canvas and the settings column side by side on a wide viewport, stacked
 * below `lg` — where a 280px column would put a block's options a screenful
 * away from the block they configure.
 *
 * Stacked, the children keep their source order, which is why the document's
 * own fields sit above the canvas there rather than under it. Side by side,
 * each child goes to the column its component declares.
 */
export function EmailEditorLayout({ className, children }: Props) {
	const { compact } = useEmailEditorState();
	const parts = React.useRef(new Set<string>());
	const register = React.useCallback((part: string) => {
		parts.current.add(part);
	}, []);

	React.useEffect(() => {
		// This effect runs after the children's, so the set is complete.
		if (!parts.current.has("canvas")) {
			console.warn(
				"<EmailEditor.Layout /> has no <EmailEditor.Canvas /> inside it: the document has nowhere to show.",
			);
		}
	}, []);

	const columns = React.Children.toArray(children).reduce<{
		main: Array<React.ReactNode>;
		side: Array<React.ReactNode>;
	}>(
		(grouped, child) => {
			grouped[slotOf(child)].push(child);
			return grouped;
		},
		{ main: [], side: [] },
	);

	return (
		<EmailEditorLayoutContext.Provider value={register}>
			{compact ? (
				<div className={cn("flex flex-col gap-4", className)}>{children}</div>
			) : (
				<div
					className={cn(
						"grid grid-cols-[minmax(0,1fr)_280px] items-start gap-6",
						className,
					)}
				>
					<div className="flex min-w-0 flex-col gap-3">{columns.main}</div>
					<div className="flex flex-col gap-4">{columns.side}</div>
				</div>
			)}
		</EmailEditorLayoutContext.Provider>
	);
}
