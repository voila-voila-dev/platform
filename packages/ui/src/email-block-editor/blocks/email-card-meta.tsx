import type { ReactNode } from "react";
import { useEmailEditorTheme } from "#/email-block-editor/context/email-editor-context.tsx";

interface Props {
	children: ReactNode;
}

/** The muted meta line a card puts under its title (author, date, period). */
export function EmailCardMeta({ children }: Props) {
	const theme = useEmailEditorTheme();
	return (
		<div
			className="text-[13px] leading-[1.4]"
			style={{ color: theme.color.muted }}
		>
			{children}
		</div>
	);
}
