import { PlayIcon } from "@phosphor-icons/react";
import { useEmailEditorTheme } from "#/email-block-editor/context/email-editor-context.tsx";

/** The play badge composited over a video thumbnail. */
export function PlayOverlay() {
	const theme = useEmailEditorTheme();
	return (
		<span
			className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex size-14 items-center justify-center rounded-full"
			style={{ backgroundColor: theme.color.brand }}
			aria-hidden
		>
			<PlayIcon
				size={24}
				weight="fill"
				color="var(--color-primary-foreground)"
			/>
		</span>
	);
}
