import { EMAIL_COLOR, EMAIL_FONT } from "#/email-block-editor/theme.ts";

/**
 * Neutral stand-in for the branded header the server prepends. Pass
 * `headerSlot` to render your own logo instead.
 */
export function CardHeaderPlaceholder() {
	return (
		<div
			className="flex justify-center pt-8 pb-2 text-[13px]"
			style={{ color: EMAIL_COLOR.muted, fontFamily: EMAIL_FONT }}
		>
			<div className="rounded-md border border-dashed px-4 py-3">
				Your header
			</div>
		</div>
	);
}
