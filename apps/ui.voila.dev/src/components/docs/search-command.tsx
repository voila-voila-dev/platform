import { FileTextIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@voila.dev/ui/components/command";
import { Kbd, KbdGroup } from "@voila.dev/ui/components/kbd";
import type MiniSearch from "minisearch";
import { useEffect, useMemo, useState } from "react";
import type { DocsSearchDocument } from "@/lib/docs-manifest.types";

type Index = MiniSearch<DocsSearchDocument>;

/**
 * The index and its documents load on first open, never before: MiniSearch and
 * `virtual:docs-search-index` are both dynamic imports, so a visitor who never
 * presses ⌘K downloads neither.
 */
let indexPromise: Promise<{
	index: Index;
	bySlug: Map<string, DocsSearchDocument>;
}> | null = null;

function loadIndex() {
	indexPromise ??= Promise.all([
		import("minisearch"),
		import("virtual:docs-search-index"),
	]).then(([{ default: MiniSearchCtor }, { default: documents }]) => {
		const index = new MiniSearchCtor<DocsSearchDocument>({
			idField: "slug",
			fields: ["title", "description", "headings", "text"],
			storeFields: ["slug"],
			searchOptions: {
				boost: { title: 4, headings: 2, description: 1.5 },
				prefix: true,
				fuzzy: 0.15,
			},
			extractField: (doc, field) => {
				const value = doc[field as keyof DocsSearchDocument];
				return Array.isArray(value) ? value.join(" ") : String(value);
			},
		});
		index.addAll(documents);
		return { index, bySlug: new Map(documents.map((d) => [d.slug, d])) };
	});
	return indexPromise;
}

export function SearchCommand() {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [data, setData] = useState<Awaited<
		ReturnType<typeof loadIndex>
	> | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				setOpen((current) => !current);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	useEffect(() => {
		if (open && !data) {
			loadIndex().then(setData);
		}
	}, [open, data]);

	const results = useMemo(() => {
		if (!data || query.trim().length < 2) return [];
		const hits = data.index.search(query).slice(0, 12);
		const grouped = new Map<
			string,
			{ slug: string; title: string; description: string }[]
		>();
		for (const hit of hits) {
			const doc = data.bySlug.get(hit.id as string);
			if (!doc) continue;
			const list = grouped.get(doc.section) ?? [];
			list.push(doc);
			grouped.set(doc.section, list);
		}
		return [...grouped.entries()];
	}, [data, query]);

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="flex h-8 w-full max-w-56 items-center gap-2 rounded-lg border border-border bg-muted/40 px-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
			>
				<MagnifyingGlassIcon aria-hidden className="size-4 shrink-0" />
				<span className="flex-1 text-left">Search…</span>
				<KbdGroup>
					<Kbd>⌘</Kbd>
					<Kbd>K</Kbd>
				</KbdGroup>
			</button>
			<CommandDialog
				open={open}
				onOpenChange={setOpen}
				title="Search documentation"
				description="Search pages, components and guides"
			>
				<Command shouldFilter={false}>
					<CommandInput
						placeholder="Search documentation…"
						value={query}
						onValueChange={setQuery}
					/>
					<CommandList>
						<CommandEmpty>
							{query.trim().length < 2
								? "Type to search the docs."
								: "No results found."}
						</CommandEmpty>
						{results.map(([section, docs]) => (
							<CommandGroup key={section} heading={section}>
								{docs.map((doc) => (
									<CommandItem
										key={doc.slug}
										value={doc.slug}
										onSelect={() => {
											setOpen(false);
											navigate({ to: doc.slug });
										}}
									>
										<FileTextIcon aria-hidden />
										<div className="min-w-0">
											<p className="truncate">{doc.title}</p>
											{doc.description && (
												<p className="truncate text-xs text-muted-foreground">
													{doc.description}
												</p>
											)}
										</div>
									</CommandItem>
								))}
							</CommandGroup>
						))}
					</CommandList>
				</Command>
			</CommandDialog>
		</>
	);
}
