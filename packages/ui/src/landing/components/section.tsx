import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import {
	type SectionVariants,
	sectionVariants,
} from "#/landing/components/section-variants.ts";
import { cn } from "#/lib/utils.ts";

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
} from "#/landing/components/section-variants.ts";
export { Section, type SectionProps };
