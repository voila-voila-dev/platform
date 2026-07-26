import { PaperPlaneRightIcon } from "@phosphor-icons/react";
import { Button } from "#/button/components/button.tsx";
import { isSubmitKey } from "#/chat/lib/is-submit-key.ts";
import { Spinner } from "#/spinner/components/spinner.tsx";
import { Textarea } from "#/textarea/components/textarea.tsx";

interface Props {
	value: string;
	onValueChange: (value: string) => void;
	onSubmit: () => void;
	placeholder: string | undefined;
	disabled: boolean;
	sending: boolean;
	submitOnEnter: boolean;
	canSend: boolean;
	invalid: boolean;
	describedBy: string | undefined;
	sendLabel: string;
}

export function ChatComposerInput({
	value,
	onValueChange,
	onSubmit,
	placeholder,
	disabled,
	sending,
	submitOnEnter,
	canSend,
	invalid,
	describedBy,
	sendLabel,
}: Props) {
	return (
		<div className="flex items-end gap-2">
			<Textarea
				value={value}
				onChange={(changeEvent) => onValueChange(changeEvent.target.value)}
				onKeyDown={(keyEvent) => {
					if (!isSubmitKey(keyEvent, submitOnEnter)) {
						return;
					}
					keyEvent.preventDefault();
					if (canSend) {
						onSubmit();
					}
				}}
				placeholder={placeholder}
				disabled={disabled}
				aria-invalid={invalid ? true : undefined}
				aria-describedby={describedBy}
				className="max-h-40 min-h-10 flex-1 resize-none"
			/>
			{/* Inline circular send button, bottom-aligned so it stays put as the
			    textarea grows. The visible label is dropped for the icon-only
			    affordance but preserved as the accessible name. */}
			<Button
				type="submit"
				size="icon"
				disabled={!canSend}
				aria-label={sendLabel}
				className="size-9 rounded-full"
			>
				{sending ? <Spinner /> : <PaperPlaneRightIcon />}
			</Button>
		</div>
	);
}
