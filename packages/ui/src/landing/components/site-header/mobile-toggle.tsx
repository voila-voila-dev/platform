import { ListIcon, XIcon } from "@phosphor-icons/react";
import { useContext } from "react";
import { SiteHeaderContext } from "#/landing/components/site-header/context/site-header-context.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"button"> {
	"aria-label": string;
}

export function SiteHeaderMobileToggle({ className, ...props }: Props) {
	const { open, toggle } = useContext(SiteHeaderContext);

	return (
		<button
			type="button"
			data-slot="site-header-mobile-toggle"
			aria-expanded={open}
			onClick={toggle}
			className={cn(
				"flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent md:hidden",
				className,
			)}
			{...props}
		>
			{open ? <XIcon className="h-6 w-6" /> : <ListIcon className="h-6 w-6" />}
		</button>
	);
}
