import { type ReactElement, useState } from "react";
import { Button } from "#/button/components/button.tsx";
import { useEmailEditorLabels } from "#/email-block-editor/context/email-editor-context.tsx";
import { Input } from "#/input/components/input.tsx";
import { Popover } from "#/popover/components/popover.tsx";

interface Props {
	trigger: ReactElement;
	/** Resolved each time the popover opens (e.g. the link under the caret). */
	initialHref: () => string;
	/** Runs as the popover opens (the toolbar saves the text selection here). */
	onOpen?: () => void;
	onApply: (href: string) => void;
	/** "Remove link" — omitted when removing makes no sense (a button). */
	onRemove?: () => void;
}

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
}: Props) {
	const [open, setOpen] = useState(false);
	const [href, setHref] = useState("");
	const { chrome, fields } = useEmailEditorLabels();

	return (
		<Popover.Root
			open={open}
			onOpenChange={(next) => {
				if (next) {
					onOpen?.();
					setHref(initialHref());
				}
				setOpen(next);
			}}
		>
			<Popover.Trigger render={trigger} />
			<Popover.Content
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
						aria-label={chrome.linkUrl}
						type="url"
						placeholder={fields.urlPlaceholder}
						value={href}
						onChange={(event) => setHref(event.target.value)}
						autoFocus
					/>
					<div className="flex items-center justify-between gap-2">
						<Button type="submit" size="sm" disabled={href.trim() === ""}>
							{chrome.apply}
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
								{chrome.removeLink}
							</Button>
						) : null}
					</div>
				</form>
			</Popover.Content>
		</Popover.Root>
	);
}
