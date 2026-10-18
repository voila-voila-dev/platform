import type { LinkClickId } from "#link-tracking/click/value-objects/link-click-id";

// Only the origins that credit their sales to the click learn its id.
export function handOffLinkClick(input: {
	readonly destinationUrl: string;
	readonly clickId: LinkClickId;
	readonly attributingOrigins: ReadonlyArray<string>;
	readonly queryParameter: string;
}): string {
	const url = new URL(input.destinationUrl);
	if (!input.attributingOrigins.includes(url.origin))
		return input.destinationUrl;
	url.searchParams.set(input.queryParameter, input.clickId);
	return url.toString();
}
