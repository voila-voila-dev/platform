// The duration does not depend on where the first difference is, so comparing
// a presented MAC against the expected one tells nothing to a caller timing
// the endpoint. Only the length shows, and a MAC's length is no secret.
export function constantTimeEquals(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let difference = 0;
	for (let index = 0; index < a.length; index += 1) {
		difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
	}
	return difference === 0;
}
