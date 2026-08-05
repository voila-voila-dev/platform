import * as React from "react";
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

interface Props {
	className?: string;
	children: React.ReactNode;
}

/**
 * The two-column arrangement: the canvas and the settings column side by side
 * on a wide viewport, stacked below `lg` — where a 280px column would put a
 * block's options a screenful away from the block they configure.
 *
 * The columns are a CSS breakpoint rather than a measured one, matching
 * `useCompactEditorLayout`, so the layout and the parts that read `compact`
 * always agree.
 */
export function EmailEditorLayout({ className, children }: Props) {
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

	return (
		<EmailEditorLayoutContext.Provider value={register}>
			<div
				className={cn(
					"grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]",
					className,
				)}
			>
				{children}
			</div>
		</EmailEditorLayoutContext.Provider>
	);
}

/** The main column: everything that is not the settings column. */
export const EMAIL_EDITOR_MAIN_COLUMN = "lg:col-start-1";
/** The settings column, spanning however many rows the main column has. */
export const EMAIL_EDITOR_SIDE_COLUMN =
	"lg:col-start-2 lg:row-start-1 lg:row-end-[-1]";
