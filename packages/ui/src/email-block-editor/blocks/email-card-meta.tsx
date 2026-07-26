import type { ReactNode } from "react";
import { EMAIL_COLOR } from "#/email-block-editor/theme.ts";

interface Props {
	children: ReactNode;
}

/** The muted meta line a card puts under its title (author, date, period). */
export function EmailCardMeta({ children }: Props) {
	return (
		<div
			className="text-[13px] leading-[1.4]"
			style={{ color: EMAIL_COLOR.muted }}
		>
			{children}
		</div>
	);
}
