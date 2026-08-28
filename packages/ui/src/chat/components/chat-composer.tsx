import * as React from "react";
import { ChatComposerFooter } from "#/chat/components/chat-composer-footer.tsx";
import { ChatComposerInput } from "#/chat/components/chat-composer-input.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends Omit<React.ComponentProps<"form">, "onSubmit"> {
	value: string;
	onValueChange: (value: string) => void;
	/** Fired on send button click, on (Cmd|Ctrl)+Enter, and — when
	 * `submitOnEnter` is set — on plain Enter. */
	onSubmit: () => void;
	placeholder?: string;
	/** Composer unusable (e.g. archived conversation). */
	disabled?: boolean;
	/**
	 * A post is in flight: button shows a spinner, submit is suppressed. The
	 * textarea stays enabled so the writer keeps focus and can draft the next
	 * message.
	 */
	sending?: boolean;
	/**
	 * Send on a plain Enter (Shift+Enter still inserts a newline), matching the
	 * mobile/messenger convention. Cmd/Ctrl+Enter always sends regardless.
	 */
	submitOnEnter?: boolean;
	/**
	 * Soft character limit: shows a live counter and disables send once
	 * exceeded. The textarea itself is not capped so the writer can trim an
	 * over-long draft instead of having input silently dropped.
	 */
	maxLength?: number;
	/**
	 * Let an empty (or whitespace-only) draft submit. For composers that can
	 * send something other than text: the app sets it while an attachment is
	 * ready to go, so the send button stays live with nothing typed.
	 */
	allowEmptySubmit?: boolean;
	/**
	 * Extra controls at the start of the input row (attach button, voice
	 * recorder), bottom-aligned with the send button as the textarea grows.
	 */
	leading?: React.ReactNode;
	/**
	 * Content above the input row — typically a `Chat.ComposerAttachments`
	 * tray of pending uploads.
	 */
	above?: React.ReactNode;
	sendLabel: string;
	error?: React.ReactNode;
	hint?: React.ReactNode;
}

export function ChatComposer({
	value,
	onValueChange,
	onSubmit,
	placeholder,
	disabled = false,
	sending = false,
	submitOnEnter = false,
	maxLength,
	allowEmptySubmit = false,
	leading,
	above,
	sendLabel,
	error,
	hint,
	className,
	...props
}: Props) {
	const errorId = React.useId();
	const hasError = error !== undefined && error !== null;
	const overLimit = maxLength !== undefined && value.length > maxLength;
	const canSend =
		!disabled &&
		!sending &&
		!overLimit &&
		(allowEmptySubmit || value.trim().length > 0);

	return (
		<form
			data-slot="chat-composer"
			onSubmit={(formEvent) => {
				formEvent.preventDefault();
				if (canSend) {
					onSubmit();
				}
			}}
			className={cn("flex flex-col gap-2", className)}
			{...props}
		>
			{above}
			<ChatComposerInput
				value={value}
				onValueChange={onValueChange}
				onSubmit={onSubmit}
				placeholder={placeholder}
				disabled={disabled}
				sending={sending}
				submitOnEnter={submitOnEnter}
				canSend={canSend}
				invalid={hasError || overLimit}
				describedBy={hasError ? errorId : undefined}
				sendLabel={sendLabel}
				leading={leading}
			/>
			{hasError ? (
				<p id={errorId} role="alert" className="text-xs text-destructive">
					{error}
				</p>
			) : null}
			<ChatComposerFooter
				hint={hint}
				length={value.length}
				maxLength={maxLength}
				overLimit={overLimit}
			/>
		</form>
	);
}
