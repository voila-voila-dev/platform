import { EMAIL_COLOR, EMAIL_FONT } from "#/email-block-editor/theme.ts";

/**
 * Neutral stand-in for the branded footer the server appends. Pass
 * `footerSlot` to render your own.
 */
export function CardFooterPlaceholder() {
	return (
		<div
			className="px-8 pt-6 pb-2 text-center text-[13px] leading-[1.6]"
			style={{ color: EMAIL_COLOR.muted, fontFamily: EMAIL_FONT }}
		>
			<div>
				The full footer (contact details, social links, unsubscribe) is added
				when the email is sent.
			</div>
		</div>
	);
}
