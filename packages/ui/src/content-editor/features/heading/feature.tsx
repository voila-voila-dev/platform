import {
	TextHFourIcon,
	TextHOneIcon,
	TextHThreeIcon,
	TextHTwoIcon,
} from "@phosphor-icons/react";
import { HeadingRules } from "@platejs/basic-nodes";
import {
	H1Plugin,
	H2Plugin,
	H3Plugin,
	H4Plugin,
} from "@platejs/basic-nodes/react";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { useContentEditorConfig } from "#/content-editor/context/content-editor-context.tsx";
import { useContentEditorTheme } from "#/content-editor/context/theme-context.ts";
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
	h1: {
		plugin: H1Plugin,
		icon: TextHOneIcon,
		label: "heading1",
		className: "font-bold text-2xl leading-tight",
		emailSize: 1,
	},
	h2: {
		plugin: H2Plugin,
		icon: TextHTwoIcon,
		label: "heading2",
		className: "font-semibold text-xl leading-tight",
		emailSize: 2,
	},
	h3: {
		plugin: H3Plugin,
		icon: TextHThreeIcon,
		label: "heading3",
		className: "font-semibold text-lg leading-snug",
		emailSize: 2,
	},
	h4: {
		plugin: H4Plugin,
		icon: TextHFourIcon,
		label: "heading4",
		className: "font-semibold text-base",
		emailSize: 2,
	},
} as const;

/** In the email appearance a heading is the sent email's: bold, in the
 * brand colour, at one of the theme's two heading sizes. */
function headingElement(level: ContentHeadingLevel) {
	return function HeadingElement(props: PlateElementProps) {
		const { appearance } = useContentEditorConfig();
		const theme = useContentEditorTheme();
		const settings = headingSettings[level];
		return appearance === "email" ? (
			<PlateElement
				{...props}
				as={level}
				className="font-bold leading-[1.3]"
				style={{
					color: theme.color.brand,
					fontSize: theme.headingFontSize[settings.emailSize],
				}}
			/>
		) : (
			<PlateElement {...props} as={level} className={settings.className} />
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
		// The markdown rule reads its `#` count from the plugin it rides, so
		// each level carries its own.
		plugins: () =>
			levels.map((level) =>
				headingSettings[level].plugin.configure({
					inputRules: [HeadingRules.markdown()],
				}),
			),
		components: Object.fromEntries(
			levels.map((level) => [level, headingElement(level)]),
		),
		toolbar,
		slash,
	};
}
