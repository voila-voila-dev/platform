import { type ReactElement, useState } from "react";
import { Button } from "#/components/button.tsx";
import { Input } from "#/components/input.tsx";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/popover.tsx";

/**
 * The shared link editing surface: a small popover with a URL field,
 * apply, and an optional remove action. The paragraph toolbar drives it with
 * text-selection callbacks; the button block edits its target through it.
 */
export function LinkPopover({
	trigger,
	initialHref,
	onOpen,
	onApply,
	onRemove,
}: {
	trigger: ReactElement;
	/** Resolved each time the popover opens (e.g. the link under the caret). */
	initialHref: () => string;
	/** Runs as the popover opens (the toolbar saves the text selection here). */
	onOpen?: () => void;
	onApply: (href: string) => void;
	/** "Remove link" — omitted when removing makes no sense (a button). */
	onRemove?: () => void;
}) {
	const [open, setOpen] = useState(false);
	const [href, setHref] = useState("");

	return (
		<Popover
			open={open}
			onOpenChange={(next) => {
				if (next) {
					onOpen?.();
					setHref(initialHref());
				}
				setOpen(next);
			}}
		>
			<PopoverTrigger render={trigger} />
			<PopoverContent
				side="bottom"
				align="start"
				className="w-[min(18rem,calc(100vw-2rem))] p-3"
			>
				<form
					className="flex flex-col gap-2"
					onSubmit={(event) => {
						event.preventDefault();
						onApply(href.trim());
						setOpen(false);
					}}
				>
					<Input
						aria-label="Link URL"
						type="url"
						placeholder="https://"
						value={href}
						onChange={(event) => setHref(event.target.value)}
						autoFocus
					/>
					<div className="flex items-center justify-between gap-2">
						<Button type="submit" size="sm" disabled={href.trim() === ""}>
							Apply
						</Button>
						{onRemove ? (
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => {
									onRemove();
									setOpen(false);
								}}
							>
								Remove link
							</Button>
						) : null}
					</div>
				</form>
			</PopoverContent>
		</Popover>
	);
}
