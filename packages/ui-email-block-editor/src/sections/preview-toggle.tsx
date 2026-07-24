import { DesktopIcon, DeviceMobileIcon } from "@phosphor-icons/react";
import {
	SegmentedControl,
	SegmentedControlItem,
} from "@voila.dev/ui/components/segmented-control";
import type { EmailEditorPreview } from "#/document/types.ts";

const PREVIEWS: ReadonlyArray<{
	readonly value: EmailEditorPreview;
	readonly label: string;
	readonly Icon: typeof DesktopIcon;
}> = [
	{ value: "desktop", label: "Desktop", Icon: DesktopIcon },
	{ value: "mobile", label: "Mobile", Icon: DeviceMobileIcon },
];

/**
 * Switches the canvas between the two renderings an email actually gets: the
 * full 600px card, and a phone-width one where grids collapse to their mobile
 * column count. Editor chrome, so it uses app styling and sits above the
 * canvas rather than inside the card.
 */
export function PreviewToggle({
	value,
	onChange,
}: {
	value: EmailEditorPreview;
	onChange: (preview: EmailEditorPreview) => void;
}) {
	return (
		<SegmentedControl
			size="sm"
			aria-label="Preview"
			value={value}
			onValueChange={(next) => onChange(next as EmailEditorPreview)}
		>
			{PREVIEWS.map((preview) => (
				<SegmentedControlItem key={preview.value} value={preview.value}>
					<preview.Icon aria-hidden />
					{preview.label}
				</SegmentedControlItem>
			))}
		</SegmentedControl>
	);
}
