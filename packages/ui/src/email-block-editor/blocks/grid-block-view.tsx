import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { useEmailEditorTheme } from "#/email-block-editor/context/email-editor-context.tsx";
import type {
	EmailEditorBlockLike,
	EmailEditorGridBlock,
} from "#/email-block-editor/document/types.ts";

interface Props<Leaf extends EmailEditorBlockLike>
	extends EmailBlockComponentProps<EmailEditorGridBlock<Leaf>> {}

/**
 * The layout shell of a multi-column row. The cells themselves — the child
 * block rows and the add slot — are composed by the canvas and slotted
 * in as `children`, so the grid owns the layout and nothing else.
 *
 * The cells mirror the count the reader will actually get in the previewed
 * client, which is what makes the desktop/mobile switch meaningful.
 */
export function GridBlockView<Leaf extends EmailEditorBlockLike>({
	block,
	preview,
	children,
}: Props<Leaf>) {
	const theme = useEmailEditorTheme();
	const columns =
		preview === "mobile" ? block.mobileColumns : block.desktopColumns;
	return (
		<div
			className="grid items-start"
			style={{
				gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
				gap: `${theme.gridGapPx}px`,
			}}
		>
			{children}
		</div>
	);
}
