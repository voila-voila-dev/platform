const SHORT_LINK = /https?:\/\/[^\s"'<>]+\/([^\s"'<>/]+)/gu;

// Following a resolved link records no click.
export function resolveShortLinks(
	text: string,
	targets: ReadonlyMap<string, string>,
): string {
	return text.replace(
		SHORT_LINK,
		(link, code: string) => targets.get(code) ?? link,
	);
}
