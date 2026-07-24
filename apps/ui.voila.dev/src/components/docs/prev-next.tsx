import manifest from "virtual:docs-manifest";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

/** Previous/next page cards, following the sidebar's flat order. */
export function PrevNext({ slug }: { slug: string }) {
	const index = manifest.flat.findIndex((item) => item.slug === slug);
	if (index === -1) return null;
	const prev = manifest.flat[index - 1];
	const next = manifest.flat[index + 1];
	if (!prev && !next) return null;

	return (
		<nav
			aria-label="Between pages"
			className="mt-12 grid gap-3 border-t border-border pt-6 sm:grid-cols-2"
		>
			{prev ? (
				<Link
					to={prev.slug}
					className="group rounded-xl border border-border p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
				>
					<span className="flex items-center gap-1 text-xs text-muted-foreground">
						<ArrowLeftIcon aria-hidden /> Previous
					</span>
					<span className="mt-1 block font-medium text-foreground group-hover:text-primary dark:group-hover:text-primary-foreground">
						{prev.title}
					</span>
				</Link>
			) : (
				<span />
			)}
			{next && (
				<Link
					to={next.slug}
					className="group rounded-xl border border-border p-4 text-right transition-colors hover:border-primary/40 hover:bg-accent/40"
				>
					<span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
						Next <ArrowRightIcon aria-hidden />
					</span>
					<span className="mt-1 block font-medium text-foreground group-hover:text-primary dark:group-hover:text-primary-foreground">
						{next.title}
					</span>
				</Link>
			)}
		</nav>
	);
}
