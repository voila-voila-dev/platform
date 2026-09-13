import {
	TextHFourIcon,
	TextHThreeIcon,
	TextHTwoIcon,
} from "@phosphor-icons/react";
import { HeadingRules } from "@platejs/basic-nodes";
import { H2Plugin, H3Plugin, H4Plugin } from "@platejs/basic-nodes/react";
import { PlateElement, type PlateElementProps } from "platejs/react";
import type {
	ContentFeature,
	ContentSlashItem,
	ContentToolbarItem,
} from "#/content-editor/features/feature-definition.tsx";
import {
	type ContentHeadingLevel,
	headingReader,
} from "#/content-editor/features/heading/reader.tsx";

const headingSettings = {
	h2: {
		plugin: H2Plugin,
		icon: TextHTwoIcon,
		label: "heading2",
		className: "font-semibold text-xl leading-tight",
	},
	h3: {
		plugin: H3Plugin,
		icon: TextHThreeIcon,
		label: "heading3",
		className: "font-semibold text-lg leading-snug",
	},
	h4: {
		plugin: H4Plugin,
		icon: TextHFourIcon,
		label: "heading4",
		className: "font-semibold text-base",
	},
} as const;

function headingElement(level: ContentHeadingLevel) {
	return function HeadingElement(props: PlateElementProps) {
		return (
			<PlateElement
				{...props}
				as={level}
				className={headingSettings[level].className}
			/>
		);
	};
}

export function headingFeature(
	levels: ReadonlyArray<ContentHeadingLevel>,
): ContentFeature {
	const toolbar: ContentToolbarItem[] = levels.map((level) => ({
		key: headingSettings[level].label,
		group: "block",
		icon: headingSettings[level].icon,
		label: headingSettings[level].label,
		isActive: (editor) => editor.api.some({ match: { type: level } }),
		run: (editor) => editor.tf.toggleBlock(level),
	}));
	const slash: ContentSlashItem[] = levels.map((level) => ({
		key: headingSettings[level].label,
		icon: headingSettings[level].icon,
		label: headingSettings[level].label,
		keywords: ["heading", "title", level],
		run: (editor) => editor.tf.toggleBlock(level),
	}));
	return {
		...headingReader(levels),
		// One markdown rule covers every level; it rides the first heading plugin.
		plugins: () =>
			levels.map((level, index) =>
				index === 0
					? headingSettings[level].plugin.configure({
							inputRules: [HeadingRules.markdown()],
						})
					: headingSettings[level].plugin,
			),
		components: Object.fromEntries(
			levels.map((level) => [level, headingElement(level)]),
		),
		toolbar,
		slash,
	};
}
