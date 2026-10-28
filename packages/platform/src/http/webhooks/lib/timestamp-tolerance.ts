/**
 * How far a signed webhook timestamp may be from now. Five minutes is what
 * Stripe and Svix document, and it is what turns a captured-and-replayed
 * webhook into a rejected one: without it a valid signature is valid forever.
 */
export const WEBHOOK_TIMESTAMP_TOLERANCE_SECONDS = 300;

/** True when a signed timestamp (in seconds) parses and sits inside the replay window. */
export function isTimestampWithinTolerance(input: {
	readonly timestamp: string;
	readonly nowSeconds: number;
	readonly toleranceSeconds?: number | undefined;
}): boolean {
	const tolerance =
		input.toleranceSeconds ?? WEBHOOK_TIMESTAMP_TOLERANCE_SECONDS;
	const timestampSeconds = Number(input.timestamp);
	return (
		input.timestamp.trim() !== "" &&
		Number.isFinite(timestampSeconds) &&
		Math.abs(input.nowSeconds - timestampSeconds) <= tolerance
	);
}
