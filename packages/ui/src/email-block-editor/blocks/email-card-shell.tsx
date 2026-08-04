import type { ReactNode } from "react";
import { EmailCardImage } from "#/email-block-editor/blocks/email-card-image.tsx";
import { useEmailEditorTheme } from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorCardImage } from "#/email-block-editor/document/types.ts";

interface Props {
	/** Omit for a card with no visual; an empty `src` renders the placeholder. */
	image?: EmailEditorCardImage;
	highlighted?: boolean;
	children: ReactNode;
}

/**
 * The one card shape. The article, product and offer blocks are all
 * card-shaped, so they share this shell (and its `emailCard` counterpart in
 * the renderer) rather than each growing its own border, radius and padding —
 * which is exactly how three cards drift into three looks.
 */
export function EmailCardShell({
	image,
	highlighted = false,
	children,
}: Props) {
	const theme = useEmailEditorTheme();
	return (
		<div
			className="overflow-hidden rounded-[14px]"
			style={{
				border: `${highlighted ? 2 : 1}px solid ${highlighted ? theme.color.brand : theme.color.border}`,
				backgroundColor: theme.color.card,
				fontFamily: theme.font,
			}}
		>
			{image === undefined ? null : <EmailCardImage image={image} />}
			<div className="flex flex-col gap-2 px-[18px] py-4">{children}</div>
		</div>
	);
}
