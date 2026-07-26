import { TextHIcon } from "@phosphor-icons/react";
import type { EmailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import { HeadingBlockSettings } from "#/email-block-editor/blocks/heading-block-settings.tsx";
import { HeadingBlockView } from "#/email-block-editor/blocks/heading-block-view.tsx";
import type { EmailEditorHeadingBlock } from "#/email-block-editor/document/types.ts";

export const headingBlockDefinition: EmailBlockDefinition<EmailEditorHeadingBlock> =
	{
		label: "Heading",
		icon: TextHIcon,
		View: HeadingBlockView,
		Settings: HeadingBlockSettings,
	};
