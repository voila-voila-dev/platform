/**
 * "user" follows `prefers-reduced-motion`; "always" and "never" override it
 * for the whole page, for an app with its own setting.
 */
export type ReducedMotionPolicy = "user" | "always" | "never";

const QUERY = "(prefers-reduced-motion: reduce)";

let policy: ReducedMotionPolicy = "user";
const listeners = new Set<(reduced: boolean) => void>();
let unwatch: (() => void) | undefined;

/** Read on every call, never at import: the server has no `matchMedia`. */
function mediaQuery(): MediaQueryList | undefined {
	return typeof window === "undefined" ||
		typeof window.matchMedia !== "function"
		? undefined
		: window.matchMedia(QUERY);
}

export function prefersReducedMotion(): boolean {
	return mediaQuery()?.matches ?? false;
}

export function reducedMotionPolicy(): ReducedMotionPolicy {
	return policy;
}

const DECIDE: Record<ReducedMotionPolicy, () => boolean> = {
	user: prefersReducedMotion,
	always: () => true,
	never: () => false,
};

/** `true`/`false` force it for one animation; a policy overrides the global one. */
export function shouldReduceMotion(
	override?: ReducedMotionPolicy | boolean,
): boolean {
	if (typeof override === "boolean") return override;
	return DECIDE[override ?? policy]();
}

function notify(): void {
	const reduced = shouldReduceMotion();
	for (const listener of listeners) listener(reduced);
}

/** Under "always" or "never" the user's setting changes nothing. */
function onMediaChange(): void {
	if (policy === "user") notify();
}

export function setReducedMotion(next: ReducedMotionPolicy): void {
	const before = shouldReduceMotion();
	policy = next;
	if (shouldReduceMotion() !== before) notify();
}

/** Fires with the effective answer when the user's setting or the policy changes it. */
export function onReducedMotionChange(
	listener: (reduced: boolean) => void,
): () => void {
	listeners.add(listener);
	if (!unwatch) {
		const query = mediaQuery();
		query?.addEventListener("change", onMediaChange);
		unwatch = () => query?.removeEventListener("change", onMediaChange);
	}
	return () => {
		listeners.delete(listener);
		if (listeners.size > 0) return;
		unwatch?.();
		unwatch = undefined;
	};
}
