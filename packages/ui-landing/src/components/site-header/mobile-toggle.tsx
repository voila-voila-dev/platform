import { ListIcon, XIcon } from "@phosphor-icons/react";
import { cn } from "@voila.dev/ui/utils";
import { useContext } from "react";
import {
	collapseBreakpoints,
	SiteHeaderContext,
} from "#/components/site-header/context/site-header-context.ts";

interface Props extends React.ComponentProps<"button"> {
	"aria-label": string;
}

export function SiteHeaderMobileToggle({ className, ...props }: Props) {
	const { collapseBelow, open, toggle } = useContext(SiteHeaderContext);

	return (
		<button
			type="button"
			data-slot="site-header-mobile-toggle"
			aria-expanded={open}
			onClick={toggle}
			className={cn(
				"flex size-11 items-center justify-center rounded-md hover:bg-accent",
				collapseBreakpoints[collapseBelow].mobileOnly,
				className,
			)}
			{...props}
		>
			{open ? <XIcon className="size-6" /> : <ListIcon className="size-6" />}
		</button>
	);
}
