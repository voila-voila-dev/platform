import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import type { EmailEditorGridBlock } from "#/email-block-editor/document/types.ts";
import { EMAIL_GRID_GAP_PX } from "#/email-block-editor/theme.ts";

interface Props extends EmailBlockComponentProps<EmailEditorGridBlock> {}

/**
 * The layout shell of a multi-column row. The cells themselves — the child
 * block rows and the add slot — are composed by the canvas and slotted
 * in as `children`, so the grid owns the layout and nothing else.
 *
 * The cells mirror the count the reader will actually get in the previewed
 * client, which is what makes the desktop/mobile switch meaningful.
 */
export function GridBlockView({ block, preview, children }: Props) {
	const columns =
		preview === "mobile" ? block.mobileColumns : block.desktopColumns;
	return (
		<div
			className="grid items-start"
			style={{
				gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
				gap: `${EMAIL_GRID_GAP_PX}px`,
			}}
		>
			{children}
		</div>
	);
}
