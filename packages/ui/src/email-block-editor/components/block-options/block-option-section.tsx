import type { ReactNode } from "react";

interface Props {
	title: string;
	children: ReactNode;
}

/**
 * A titled group of rows. §1.4 of the editor plan: once a block carries more
 * than a handful of options they are split into "Content", "Appearance" and
 * "Link", always in that order.
 */
export function BlockOptionSection({ title, children }: Props) {
	return (
		<section className="flex flex-col gap-3">
			<h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
				{title}
			</h4>
			{children}
		</section>
	);
}
