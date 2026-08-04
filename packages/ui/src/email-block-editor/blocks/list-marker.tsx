import { useEmailEditorTheme } from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorListMarker } from "#/email-block-editor/document/types.ts";

interface Props {
	marker: EmailEditorListMarker;
	index: number;
}

/** The marker shown before an item, mirroring the domain `emailList`. */
export function ListMarker({ marker, index }: Props) {
	const theme = useEmailEditorTheme();
	if (marker === "badge") {
		return (
			<span
				className="flex size-6 shrink-0 items-center justify-center rounded-full font-semibold text-[12px] text-primary-foreground"
				style={{ backgroundColor: theme.color.brand }}
				aria-hidden
			>
				{index + 1}
			</span>
		);
	}
	return (
		<span
			className="w-6 shrink-0 text-[16px] leading-[1.6]"
			style={{ color: theme.color.muted }}
			aria-hidden
		>
			{marker === "number" ? `${index + 1}.` : "•"}
		</span>
	);
}
