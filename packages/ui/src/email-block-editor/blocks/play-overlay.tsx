import { PlayIcon } from "@phosphor-icons/react";
import { EMAIL_COLOR } from "#/email-block-editor/theme.ts";

/** The play badge composited over a video thumbnail. */
export function PlayOverlay() {
	return (
		<span
			className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex size-14 items-center justify-center rounded-full"
			style={{ backgroundColor: EMAIL_COLOR.brand }}
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
