import { ImageIcon } from "@phosphor-icons/react";
import type { EmailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import { ImageBlockSettings } from "#/email-block-editor/blocks/image-block-settings.tsx";
import { ImageBlockView } from "#/email-block-editor/blocks/image-block-view.tsx";
import type { EmailEditorImageBlock } from "#/email-block-editor/document/types.ts";

export const imageBlockDefinition: EmailBlockDefinition<EmailEditorImageBlock> =
	{
		type: "image",
		label: "Image",
		icon: ImageIcon,
		createEmpty: (id) => ({
			id,
			type: "image",
			src: "",
			alt: "",
			href: "",
			width: "full",
			overlay: "none",
			rounded: true,
		}),
		View: ImageBlockView,
		Settings: ImageBlockSettings,
	};
