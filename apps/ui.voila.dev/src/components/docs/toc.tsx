import { cn } from "@voila.dev/ui/utils";
import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/remark-toc-export";

/**
 * "On this page" rail with scroll-spy: one IntersectionObserver over the
 * article's headings keeps the entry nearest the top of the viewport lit.
 */
export function Toc({ toc }: { toc: TocEntry[] }) {
	const [activeId, setActiveId] = useState<string>("");

	useEffect(() => {
		if (toc.length === 0) return;
		const visible = new Set<string>();
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) visible.add(entry.target.id);
					else visible.delete(entry.target.id);
				}
				// Highlight the first visible heading in document order; when none
				// is visible (long section), keep whatever was lit last.
				const first = toc.find((t) => visible.has(t.id));
				if (first) setActiveId(first.id);
			},
			{ rootMargin: "-80px 0px -66% 0px" },
		);
		for (const entry of toc) {
			const el = document.getElementById(entry.id);
			if (el) observer.observe(el);
		}
		return () => observer.disconnect();
	}, [toc]);

	if (toc.length === 0) return null;

	return (
		<nav aria-label="On this page" className="text-[0.8125rem]">
			<p className="mb-2 font-heading font-semibold text-foreground">
				On this page
			</p>
			<ul className="space-y-1 border-l border-border">
				{toc.map((entry) => (
					<li key={entry.id}>
						<a
							href={`#${entry.id}`}
							className={cn(
								"-ml-px block border-l py-0.5 leading-snug transition-colors",
								entry.depth === 3 ? "pl-6" : "pl-3",
								entry.id === activeId
									? "border-primary font-medium text-primary dark:text-primary-foreground"
									: "border-transparent text-muted-foreground hover:text-foreground",
							)}
						>
							{entry.text}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
