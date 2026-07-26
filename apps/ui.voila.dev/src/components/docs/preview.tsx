import { cn } from "@voila.dev/ui/utils";
import type { ReactNode } from "react";

/**
 * Frames a live example so every component page presents its previews the same
 * way. React port of the old `preview.astro`; the `.preview__*` styling lives
 * in `docs.css`.
 */
interface PreviewProps {
	/** Short caption above the example, e.g. "Sizes" or "Disabled". */
	label?: string;
	/** `row` wraps the examples inline; `stack` gives each its own full width. */
	layout?: "row" | "stack" | "center";
	/** Let a wide example scroll inside the frame instead of the page. */
	scroll?: boolean;
	children: ReactNode;
}

export default function Preview({
	label,
	layout = "row",
	scroll = false,
	children,
}: PreviewProps) {
	return (
		<div className={cn("preview not-prose", scroll && "preview--scroll")}>
			{label && <p className="preview__label">{label}</p>}
			<div
				className={cn(
					"preview__stage",
					layout === "stack" && "preview__stage--stack",
					layout === "center" && "preview__stage--center",
				)}
			>
				{children}
			</div>
		</div>
	);
}
