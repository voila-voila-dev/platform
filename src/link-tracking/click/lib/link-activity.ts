import { type DateTime, Effect } from "effect";
import type { LinkClickRepository } from "#link-tracking/click/services/link-click-repository";
import type { TrackedLinkRepository } from "#link-tracking/link/services/tracked-link-repository";

export interface LinkActivity {
	// Each short-link code to the address it redirects to.
	readonly targets: ReadonlyMap<string, string>;
	// Oldest first.
	readonly clicks: ReadonlyArray<{
		readonly url: string;
		readonly at: DateTime.Utc;
	}>;
}

// The short links one send minted (its `context`), and every click on them.
export function linkActivity(
	repositories: {
		readonly links: TrackedLinkRepository["Service"];
		readonly clicks: LinkClickRepository["Service"];
	},
	context: string,
) {
	return Effect.gen(function* () {
		const links = yield* repositories.links.listByContext(context);
		const clicks =
			links.length === 0
				? []
				: yield* repositories.clicks.listByLinkIds(
						links.map((link) => link.id),
					);
		const destinationOf = new Map<string, string>(
			links.map((link) => [link.id, link.destinationUrl]),
		);
		return {
			targets: new Map(links.map((link) => [link.code, link.destinationUrl])),
			clicks: clicks.map((click) => ({
				url: destinationOf.get(click.linkId) ?? "",
				at: click.clickedAt,
			})),
		} satisfies LinkActivity;
	});
}
