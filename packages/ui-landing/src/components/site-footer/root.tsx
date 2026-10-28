import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";
import { Container } from "#/components/container.tsx";

interface Props extends React.ComponentProps<"footer"> {}

/**
 * Marketing site footer. Compose: Root > Columns (Brand > BrandDescription +
 * SocialLinks > SocialLink…, Column > ColumnTitle + ColumnList > ColumnLink…) +
 * Bottom > BottomText…
 */
export function SiteFooterRoot({ className, children, ...props }: Props) {
	return (
		<footer
			data-slot="site-footer"
			className={cn("border-t border-border bg-muted/30", className)}
			{...props}
		>
			<Container>{children}</Container>
		</footer>
	);
}
