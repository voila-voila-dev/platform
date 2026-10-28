import type { ReactNode } from "react";
import { useContentEditorTheme } from "#/content-editor/context/theme-context.ts";

interface Props {
	children: ReactNode;
}

/** The muted meta line a card puts under its title (author, date, period). */
export function EmailCardMeta({ children }: Props) {
	const theme = useContentEditorTheme();
	return (
		<div
			className="text-[13px] leading-[1.4]"
			style={{ color: theme.color.muted }}
		>
			{children}
		</div>
	);
}
