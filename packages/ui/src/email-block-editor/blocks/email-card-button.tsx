import { EMAIL_COLOR } from "#/email-block-editor/theme.ts";

interface Props {
	label: string;
}

/** A card's call to action. The target lives in the settings, so the canvas
 * only shows the pill; an empty label means the card has no button. */
export function EmailCardButton({ label }: Props) {
	if (label === "") {
		return null;
	}
	return (
		<span
			className="mt-1 inline-block self-start rounded-lg px-[18px] py-[10px] font-semibold text-[14px] text-primary-foreground"
			style={{ backgroundColor: EMAIL_COLOR.brand }}
		>
			{label}
		</span>
	);
}
