import { ColumnsIcon } from "@phosphor-icons/react";
import type {
	EmailBlockComponentProps,
	EmailBlockDefinition,
} from "#/email-block-editor/blocks/block-definitions.tsx";
import type {
	EmailEditorGridBlock,
	EmailEditorGridColumns,
	EmailEditorGridMobileColumns,
} from "#/email-block-editor/document/types.ts";
import { BlockOptionSection } from "#/email-block-editor/sections/block-options/block-option-row.tsx";
import { SegmentedOption } from "#/email-block-editor/sections/block-options/segmented-option.tsx";

/** The gutter between two cells, mirrored by the renderer's cell padding. */
export const EMAIL_GRID_GAP_PX = 16;

const DESKTOP_COLUMN_OPTIONS: ReadonlyArray<{
	readonly value: EmailEditorGridColumns;
	readonly label: string;
}> = [
	{ value: 1, label: "1" },
	{ value: 2, label: "2" },
	{ value: 3, label: "3" },
	{ value: 4, label: "4" },
];

const MOBILE_COLUMN_OPTIONS: ReadonlyArray<{
	readonly value: EmailEditorGridMobileColumns;
	readonly label: string;
}> = [
	{ value: 1, label: "1" },
	{ value: 2, label: "2" },
];

/**
 * The layout shell of a multi-column row. The cells themselves — the child
 * block rows and the add slot — are composed by the canvas and slotted
 * in as `children`, so the grid owns the layout and nothing else.
 *
 * The cells mirror the count the reader will actually get in the previewed
 * client, which is what makes the desktop/mobile switch meaningful.
 */
function GridBlockView({
	block,
	preview,
	children,
}: EmailBlockComponentProps<EmailEditorGridBlock>) {
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

function GridBlockSettings({
	block,
	onChange,
}: EmailBlockComponentProps<EmailEditorGridBlock>) {
	return (
		<BlockOptionSection title="Appearance">
			<SegmentedOption
				label="Columns (desktop)"
				value={block.desktopColumns}
				options={DESKTOP_COLUMN_OPTIONS}
				onChange={(desktopColumns) => onChange({ ...block, desktopColumns })}
			/>
			<SegmentedOption
				label="Columns (mobile)"
				value={block.mobileColumns}
				options={MOBILE_COLUMN_OPTIONS}
				onChange={(mobileColumns) => onChange({ ...block, mobileColumns })}
				description={
					block.mobileColumns === block.desktopColumns
						? undefined
						: "A different column count on mobile relies on a media query: the Gmail app on a third-party account ignores it and falls back to one column."
				}
			/>
		</BlockOptionSection>
	);
}

export const gridBlockDefinition: EmailBlockDefinition<EmailEditorGridBlock> = {
	label: "Columns",
	icon: ColumnsIcon,
	View: GridBlockView,
	Settings: GridBlockSettings,
};
