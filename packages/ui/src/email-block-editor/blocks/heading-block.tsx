import { TextHIcon } from "@phosphor-icons/react";
import type {
	EmailBlockComponentProps,
	EmailBlockDefinition,
} from "#/email-block-editor/blocks/block-definitions.tsx";
import { BlockTextInput } from "#/email-block-editor/blocks/block-text-input.tsx";
import type {
	EmailEditorHeadingBlock,
	EmailEditorHeadingLevel,
} from "#/email-block-editor/document/types.ts";
import { SelectOption } from "#/email-block-editor/sections/block-options/select-option.tsx";
import { TextOption } from "#/email-block-editor/sections/block-options/text-option.tsx";
import { EMAIL_COLOR, EMAIL_FONT } from "#/email-block-editor/theme.ts";

/** The two heading sizes, mirroring the domain `emailHeading` component. */
export const EMAIL_HEADING_STYLE: {
	readonly [Level in EmailEditorHeadingLevel]: {
		readonly fontSize: string;
		readonly label: string;
	};
} = {
	1: { fontSize: "22px", label: "Main title (H1)" },
	2: { fontSize: "17px", label: "Subtitle (H2)" },
};

const HEADING_LEVEL_OPTIONS: ReadonlyArray<{
	readonly value: EmailEditorHeadingLevel;
	readonly label: string;
}> = [
	{ value: 1, label: EMAIL_HEADING_STYLE[1].label },
	{ value: 2, label: EMAIL_HEADING_STYLE[2].label },
];

/**
 * A title line, edited in place. Mirrors the domain `emailHeading` component
 * (bold, brand-colored) so the canvas matches the sent email; the level picks
 * between the email's own title and a section heading.
 */
function HeadingBlockView({
	block,
	onChange,
}: EmailBlockComponentProps<EmailEditorHeadingBlock>) {
	return (
		<BlockTextInput
			ariaLabel="Heading"
			value={block.text}
			onChange={(text) => onChange({ ...block, text })}
			placeholder="Your heading"
			className="font-bold leading-[1.3]"
			style={{
				fontFamily: EMAIL_FONT,
				color: EMAIL_COLOR.brand,
				fontSize: EMAIL_HEADING_STYLE[block.level].fontSize,
			}}
		/>
	);
}

function HeadingBlockSettings({
	block,
	onChange,
}: EmailBlockComponentProps<EmailEditorHeadingBlock>) {
	return (
		<>
			<TextOption
				label="Text"
				value={block.text}
				onChange={(text) => onChange({ ...block, text })}
			/>
			<SelectOption
				label="Level"
				value={block.level}
				options={HEADING_LEVEL_OPTIONS}
				onChange={(level) => onChange({ ...block, level })}
			/>
		</>
	);
}

export const headingBlockDefinition: EmailBlockDefinition<EmailEditorHeadingBlock> =
	{
		label: "Heading",
		icon: TextHIcon,
		View: HeadingBlockView,
		Settings: HeadingBlockSettings,
	};
