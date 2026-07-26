import { useContext } from "react";
import { Container } from "#/landing/components/container.tsx";
import { SiteHeaderContext } from "#/landing/components/site-header/context/site-header-context.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function SiteHeaderMobileMenu({ className, children, ...props }: Props) {
	const { open } = useContext(SiteHeaderContext);

	return (
		<div
			data-slot="site-header-mobile-menu"
			className={cn(
				"border-t border-border bg-background md:hidden",
				!open && "hidden",
				className,
			)}
			{...props}
		>
			<Container>
				<ul className="flex flex-col gap-2 py-4">{children}</ul>
			</Container>
		</div>
	);
}
