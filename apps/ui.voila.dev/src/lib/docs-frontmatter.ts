/**
 * The frontmatter contract for `content/docs/**​/*.mdx`, and the one place that
 * decides what a valid page header looks like.
 *
 * Nothing validated this before, which is how the six `start/` pages drifted
 * into having no `sidebar` block at all while the other 188 have one, and how
 * ten pages carried a `sidebar.label` that repeated `title` word for word. Both
 * are invisible until you notice the sidebar ordering is not what you meant.
 *
 * Build-time only: `docs-plugin.ts` runs this while reading the manifest, so a
 * malformed page fails the build instead of rendering slightly wrong.
 */
import { z } from "zod";

export const docFrontmatterSchema = z.object({
	/** Page heading, and the sidebar entry. */
	title: z.string().min(1),
	/**
	 * One sentence. Shown under the title, in the ⌘K palette and as the page's
	 * meta description, so it has to stand alone away from the page.
	 */
	description: z.string().min(1),
	/**
	 * Position within the section, for sections ordered by number. Ties fall
	 * through to alphabetical. Mutually exclusive with `category`: which one a
	 * page needs is decided by its section in `docs-nav.config.ts`, and
	 * `docs-plugin.ts` enforces it.
	 */
	sidebar: z.object({ order: z.number().int().nonnegative() }).optional(),
	/**
	 * Sub-group within the section, for sections that declare `categories`.
	 * Pages are alphabetical inside their group, so adding a component never
	 * means renumbering its neighbours.
	 */
	category: z.string().min(1).optional(),
});

export type DocFrontmatter = z.infer<typeof docFrontmatterSchema>;

/**
 * Validates one page's frontmatter, or throws naming the file and the field.
 * The thrown message is what someone sees in a failed build, so it says which
 * page and which key rather than dumping the whole issue list.
 */
export function parseFrontmatter(file: string, data: unknown): DocFrontmatter {
	const result = docFrontmatterSchema.safeParse(data);
	if (result.success) return result.data;
	const detail = result.error.issues
		.map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
		.join("; ");
	throw new Error(`${file} — invalid frontmatter. ${detail}`);
}
