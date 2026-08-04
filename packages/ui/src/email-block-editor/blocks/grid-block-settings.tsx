import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { BlockOptionSection } from "#/email-block-editor/components/block-options/block-option-section.tsx";
import { SegmentedOption } from "#/email-block-editor/components/block-options/segmented-option.tsx";
import { useEmailEditorLabels } from "#/email-block-editor/context/email-editor-context.tsx";
import type {
	EmailEditorGridBlock,
	EmailEditorGridColumns,
	EmailEditorGridMobileColumns,
} from "#/email-block-editor/document/types.ts";

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

interface Props extends EmailBlockComponentProps<EmailEditorGridBlock> {}

/** The settings panel for a grid block: column counts and spacing. */
export function GridBlockSettings({ block, onChange }: Props) {
	const { chrome, blocks } = useEmailEditorLabels();
	return (
		<BlockOptionSection title={chrome.sectionAppearance}>
			<SegmentedOption
				label={blocks.grid.desktopColumns}
				value={block.desktopColumns}
				options={DESKTOP_COLUMN_OPTIONS}
				onChange={(desktopColumns) => onChange({ ...block, desktopColumns })}
			/>
			<SegmentedOption
				label={blocks.grid.mobileColumns}
				value={block.mobileColumns}
				options={MOBILE_COLUMN_OPTIONS}
				onChange={(mobileColumns) => onChange({ ...block, mobileColumns })}
				description={
					block.mobileColumns === block.desktopColumns
						? undefined
						: blocks.grid.mobileColumnsDescription
				}
			/>
		</BlockOptionSection>
	);
}
