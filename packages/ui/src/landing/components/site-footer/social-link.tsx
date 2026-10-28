import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"a"> {
	"aria-label": string;
}

export function SiteFooterSocialLink({ className, render, ...props }: Props) {
	return useRender({
		defaultTagName: "a",
		props: mergeProps<"a">(
			{
				className: cn(
					"text-muted-foreground transition-colors hover:text-foreground [&_svg]:h-5 [&_svg]:w-5",
					className,
				),
			},
			props,
		),
		render,
		state: {
			slot: "site-footer-social-link",
		},
	});
}
