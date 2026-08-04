import { DesktopIcon, DeviceMobileIcon } from "@phosphor-icons/react";
import {
	useEmailEditorActions,
	useEmailEditorLabels,
	useEmailEditorState,
} from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorPreview } from "#/email-block-editor/document/types.ts";
import { SegmentedControl } from "#/segmented-control/components/segmented-control.tsx";

const PREVIEW_ICON: {
	readonly [Preview in EmailEditorPreview]: typeof DesktopIcon;
} = { desktop: DesktopIcon, mobile: DeviceMobileIcon };

/**
 * Switches the canvas between the two renderings an email actually gets: the
 * full 600px card, and a phone-width one where grids collapse to their mobile
 * column count. Editor chrome, so it uses app styling and sits above the
 * canvas rather than inside the card.
 */
export function PreviewToggle() {
	const { preview } = useEmailEditorState();
	const { setPreview } = useEmailEditorActions();
	const { chrome } = useEmailEditorLabels();
	const previews: ReadonlyArray<{
		readonly value: EmailEditorPreview;
		readonly label: string;
	}> = [
		{ value: "desktop", label: chrome.previewDesktop },
		{ value: "mobile", label: chrome.previewMobile },
	];
	return (
		<SegmentedControl.Root
			size="sm"
			aria-label={chrome.preview}
			value={preview}
			onValueChange={(next) => setPreview(next as EmailEditorPreview)}
		>
			{previews.map((option) => {
				const Icon = PREVIEW_ICON[option.value];
				return (
					<SegmentedControl.Item key={option.value} value={option.value}>
						<Icon aria-hidden />
						{option.label}
					</SegmentedControl.Item>
				);
			})}
		</SegmentedControl.Root>
	);
}
