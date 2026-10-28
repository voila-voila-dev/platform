// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	onReducedMotionChange,
	prefersReducedMotion,
	reducedMotionPolicy,
	setReducedMotion,
	shouldReduceMotion,
} from "#/accessibility/reduced-motion.ts";

let reduce = false;
let changeListeners = new Set<() => void>();

function userChanges(next: boolean): void {
	reduce = next;
	for (const listener of changeListeners) listener();
}

beforeEach(() => {
	reduce = false;
	changeListeners = new Set();
	vi.stubGlobal("matchMedia", (query: string) => ({
		get matches() {
			return query === "(prefers-reduced-motion: reduce)" && reduce;
		},
		addEventListener: (_: string, listener: () => void) =>
			changeListeners.add(listener),
		removeEventListener: (_: string, listener: () => void) =>
			changeListeners.delete(listener),
	}));
});

afterEach(() => {
	setReducedMotion("user");
	vi.unstubAllGlobals();
});

describe("reduced motion", () => {
	it.each([
		["user", false, false],
		["user", true, true],
		["always", false, true],
		["always", true, true],
		["never", false, false],
		["never", true, false],
	] as const)(
		"policy %s with the user asking %s reduces: %s",
		(policy, user, expected) => {
			reduce = user;
			setReducedMotion(policy);
			expect(reducedMotionPolicy()).toBe(policy);
			expect(prefersReducedMotion()).toBe(user);
			expect(shouldReduceMotion()).toBe(expected);
		},
	);

	it("lets one animation override the policy", () => {
		setReducedMotion("always");
		expect(shouldReduceMotion(false)).toBe(false);
		expect(shouldReduceMotion("never")).toBe(false);
		reduce = true;
		setReducedMotion("never");
		expect(shouldReduceMotion(true)).toBe(true);
		expect(shouldReduceMotion("user")).toBe(true);
	});

	it("tells listeners when the user's setting or the policy changes the answer", () => {
		const listener = vi.fn();
		const leave = onReducedMotionChange(listener);
		userChanges(true);
		setReducedMotion("always");
		setReducedMotion("never");
		userChanges(false);
		expect(listener.mock.calls).toEqual([[true], [false]]);
		leave();
		expect(changeListeners.size).toBe(0);
	});
});
