import { DesktopIcon, DeviceMobileIcon } from "@phosphor-icons/react";
import {
	useEmailEditorActions,
	useEmailEditorState,
} from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorPreview } from "#/email-block-editor/document/types.ts";
import { SegmentedControl } from "#/segmented-control/components/segmented-control.tsx";

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
export function PreviewToggle() {
	const { preview } = useEmailEditorState();
	const { setPreview } = useEmailEditorActions();
	return (
		<SegmentedControl.Root
			size="sm"
			aria-label="Preview"
			value={preview}
			onValueChange={(next) => setPreview(next as EmailEditorPreview)}
		>
			{PREVIEWS.map((preview) => (
				<SegmentedControl.Item key={preview.value} value={preview.value}>
					<preview.Icon aria-hidden />
					{preview.label}
				</SegmentedControl.Item>
			))}
		</SegmentedControl.Root>
	);
}
