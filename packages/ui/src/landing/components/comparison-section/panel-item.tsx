import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";
import { useContext } from "react";
import { ComparisonPanelContext } from "#/landing/components/comparison-section/context/comparison-section-context.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"li"> {
	/** Replaces the default XCircle/CheckCircle mark. */
	icon?: React.ReactNode;
}

export function ComparisonPanelItem({
	icon,
	className,
	children,
	...props
}: Props) {
	const variant = useContext(ComparisonPanelContext);

	return (
		<li
			data-slot="comparison-panel-item"
			className={cn("flex animate-fade-up items-start gap-3", className)}
			{...props}
		>
			{icon ??
				(variant === "without" ? (
					<XCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
				) : (
					<CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-success" />
				))}
			<span className={cn(variant === "without" && "text-muted-foreground")}>
				{children}
			</span>
		</li>
	);
}
