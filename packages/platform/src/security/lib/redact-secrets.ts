export const REDACTED_SECRET = "[redacted]";

export function redactSecrets(
	text: string,
	secrets: ReadonlyArray<string>,
): string {
	return secrets.reduce(
		(masked, secret) =>
			secret.length === 0 ? masked : masked.replaceAll(secret, REDACTED_SECRET),
		text,
	);
}
