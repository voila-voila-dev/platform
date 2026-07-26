import { EMAIL_COLOR } from "#/email-block-editor/theme.ts";

/** A horizontal rule. Mirrors the domain `emailDivider` component. */
export function DividerBlockView() {
	return (
		<hr className="my-2 border-t" style={{ borderColor: EMAIL_COLOR.border }} />
	);
}
