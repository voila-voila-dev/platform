import { ImageIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import type { EmailEditorCardImage } from "#/document/types.ts";
import { EMAIL_COLOR, EMAIL_FONT } from "#/theme.ts";

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
}: {
	/** Omit for a card with no visual; an empty `src` renders the placeholder. */
	image?: EmailEditorCardImage;
	highlighted?: boolean;
	children: ReactNode;
}) {
	return (
		<div
			className="overflow-hidden rounded-[14px]"
			style={{
				border: `${highlighted ? 2 : 1}px solid ${highlighted ? EMAIL_COLOR.brand : EMAIL_COLOR.border}`,
				backgroundColor: EMAIL_COLOR.card,
				fontFamily: EMAIL_FONT,
			}}
		>
			{image === undefined ? null : <EmailCardImage image={image} />}
			<div className="flex flex-col gap-2 px-[18px] py-4">{children}</div>
		</div>
	);
}

function EmailCardImage({ image }: { image: EmailEditorCardImage }) {
	if (image.src === "") {
		return (
			<div
				className="flex h-28 items-center justify-center"
				style={{
					backgroundColor: EMAIL_COLOR.canvas,
					color: EMAIL_COLOR.muted,
				}}
			>
				<ImageIcon size={24} aria-hidden />
			</div>
		);
	}
	return <img src={image.src} alt={image.alt} className="block w-full" />;
}

/** The muted meta line a card puts under its title (author, date, period). */
export function EmailCardMeta({ children }: { children: ReactNode }) {
	return (
		<div
			className="text-[13px] leading-[1.4]"
			style={{ color: EMAIL_COLOR.muted }}
		>
			{children}
		</div>
	);
}

/** A card's call to action. The target lives in the settings, so the canvas
 * only shows the pill; an empty label means the card has no button. */
export function EmailCardButton({ label }: { label: string }) {
	if (label === "") {
		return null;
	}
	return (
		<span
			className="mt-1 inline-block self-start rounded-lg px-[18px] py-[10px] font-semibold text-[14px] text-white"
			style={{ backgroundColor: EMAIL_COLOR.brand }}
		>
			{label}
		</span>
	);
}
