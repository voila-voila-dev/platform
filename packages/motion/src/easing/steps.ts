import type { Easing } from "#/easing/types.ts";

/** CSS `steps(count, jump-start | jump-end)`. */
export function steps(
	count: number,
	direction: "start" | "end" = "end",
): Easing {
	const jump = direction === "start" ? 1 : 0;
	return function stepped(progress) {
		if (progress >= 1) {
			return 1;
		}
		const clamped = Math.max(0, progress);
		return Math.min(1, (Math.floor(clamped * count) + jump) / count);
	};
}
