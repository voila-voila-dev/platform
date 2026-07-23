import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@voila.dev/ui/lib/utils";

import {
	type SectionVariants,
	sectionVariants,
} from "#/components/section-variants.ts";

type SectionProps = useRender.ComponentProps<"section"> & SectionVariants;

/**
 * Full-width landing band — vertical rhythm + background treatment. Marketing
 * scale (`py-24`…): not interchangeable with the app-shell `Section` from
 * `@voila.dev/ui`. Renders a `section`; pass `render` to swap the tag.
 */
function Section({
	className,
	render,
	spacing,
	background,
	...props
}: SectionProps) {
	return useRender({
		defaultTagName: "section",
		props: mergeProps<"section">(
			{
				className: cn(sectionVariants({ spacing, background }), className),
			},
			props,
		),
		render,
		state: {
			slot: "landing-section",
		},
	});
}

export {
	type SectionVariants,
	sectionBackgroundOptions,
	sectionSpacingOptions,
	sectionVariants,
} from "#/components/section-variants.ts";
export { Section, type SectionProps };
