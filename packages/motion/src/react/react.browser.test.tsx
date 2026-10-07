import { act, cleanup, render } from "@testing-library/react";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { commands } from "vitest/browser";
import { animate } from "#/animate/animate.ts";
import { Presence, usePresence } from "#/react/presence.tsx";
import { useAnimate } from "#/react/use-animate.ts";
import { useMotionValue } from "#/react/use-motion-value.ts";
import { useReducedMotion } from "#/react/use-reduced-motion.ts";
import { useSpring } from "#/react/use-spring.ts";
import { useTransform } from "#/react/use-transform.ts";
import type { MotionValue } from "#/value/motion-value.ts";

afterEach(async () => {
	cleanup();
	await commands.emulateMedia({ reducedMotion: null });
});

function waitFor(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("useAnimate", () => {
	it("scopes selectors to its element and stops its animations on unmount", async () => {
		let controls: ReturnType<ReturnType<typeof useAnimate>[1]> | undefined;
		function Card() {
			const [scope, animate] = useAnimate<HTMLDivElement>();
			React.useEffect(() => {
				controls = animate("p", { opacity: [0, 1] }, { duration: 1 });
			}, [animate]);
			return (
				<div ref={scope}>
					<p data-testid="inside">inside</p>
				</div>
			);
		}
		const { getByTestId, unmount } = render(
			<>
				<Card />
				<p data-testid="outside">outside</p>
			</>,
		);
		expect(getByTestId("inside").getAnimations()).toHaveLength(1);
		expect(getByTestId("outside").getAnimations()).toHaveLength(0);
		unmount();
		expect(controls?.state).toBe("finished");
	});
});

describe("useMotionValue, useTransform and useSpring", () => {
	it("derives a value and follows a target with a spring", async () => {
		const seen: { x?: MotionValue<number>; opacity?: MotionValue<number> } = {};
		function Follower({ target }: { target: number }) {
			const x = useSpring(target, { duration: 0.2 });
			const opacity = useTransform(x, [0, 100], [1, 0]);
			seen.x = x;
			seen.opacity = opacity;
			return null;
		}
		const { rerender } = render(<Follower target={0} />);
		rerender(<Follower target={100} />);
		await waitFor(80);
		const midway = seen.x?.get() ?? 0;
		expect(midway).toBeGreaterThan(0);
		expect(midway).toBeLessThan(100);
		expect(seen.opacity?.get()).toBeCloseTo(1 - midway / 100, 1);
		await waitFor(600);
		expect(seen.x?.get()).toBe(100);
		expect(seen.opacity?.get()).toBe(0);
	});

	it("follows another motion value", async () => {
		let follower: MotionValue<number> | undefined;
		let source: MotionValue<number> | undefined;
		function Follower() {
			source = useMotionValue(0);
			follower = useSpring(source, { duration: 0.1 });
			return null;
		}
		render(<Follower />);
		act(() => source?.set(50));
		await waitFor(500);
		expect(follower?.get()).toBe(50);
	});

	it("computes from several values", () => {
		let sum: MotionValue<number> | undefined;
		let a: MotionValue<number> | undefined;
		function Sum() {
			a = useMotionValue(1);
			const b = useMotionValue(2);
			sum = useTransform([a, b], (left: number, right: number) => left + right);
			return null;
		}
		render(<Sum />);
		expect(sum?.get()).toBe(3);
		a?.set(5);
		expect(sum?.get()).toBe(7);
	});
});

describe("useReducedMotion", () => {
	it("follows the reader's setting as it changes", async () => {
		const seen: boolean[] = [];
		function Probe() {
			seen.push(useReducedMotion());
			return null;
		}
		render(<Probe />);
		expect(seen.at(-1)).toBe(false);
		await act(() => commands.emulateMedia({ reducedMotion: "reduce" }));
		await waitFor(50);
		expect(seen.at(-1)).toBe(true);
	});
});

describe("Presence", () => {
	function exitFade(element: Element) {
		return animate(element, { opacity: 0 }, { duration: 0.15 });
	}

	it("keeps a removed child until its exit has played, inert meanwhile", async () => {
		const onExitComplete = vi.fn();
		function List({ open }: { open: boolean }) {
			return (
				<Presence onExitComplete={onExitComplete}>
					{open && <p key="note" data-testid="note" exit={exitFade} />}
				</Presence>
			);
		}
		const { rerender, queryByTestId } = render(<List open />);
		rerender(<List open={false} />);
		const leaving = queryByTestId("note");
		expect(leaving).not.toBeNull();
		expect(leaving?.hasAttribute("inert")).toBe(true);
		expect(leaving?.getAnimations()).toHaveLength(1);
		await waitFor(400);
		expect(queryByTestId("note")).toBeNull();
		expect(onExitComplete).toHaveBeenCalledOnce();
	});

	it("keeps a child that comes back before its exit finished", async () => {
		function List({ open }: { open: boolean }) {
			return (
				<Presence>
					{open && <p key="note" data-testid="note" exit={exitFade} />}
				</Presence>
			);
		}
		const { rerender, queryByTestId } = render(<List open />);
		rerender(<List open={false} />);
		rerender(<List open />);
		await waitFor(400);
		expect(queryByTestId("note")).not.toBeNull();
	});

	it("waits for a child that plays its own exit through usePresence", async () => {
		function Note() {
			const [isPresent, safeToRemove] = usePresence();
			React.useEffect(() => {
				if (!isPresent) setTimeout(safeToRemove, 100);
			}, [isPresent, safeToRemove]);
			return <p data-testid="note">{isPresent ? "here" : "leaving"}</p>;
		}
		function List({ open }: { open: boolean }) {
			return <Presence>{open && <Note key="note" />}</Presence>;
		}
		const { rerender, queryByTestId } = render(<List open />);
		rerender(<List open={false} />);
		expect(queryByTestId("note")?.textContent).toBe("leaving");
		await waitFor(300);
		expect(queryByTestId("note")).toBeNull();
	});

	it("removes at once a child with no exit", () => {
		function List({ open }: { open: boolean }) {
			return <Presence>{open && <p key="note" data-testid="note" />}</Presence>;
		}
		const { rerender, queryByTestId } = render(<List open />);
		rerender(<List open={false} />);
		expect(queryByTestId("note")).toBeNull();
	});

	it("brings back a child that returns mid-exit as it was, and clickable", async () => {
		function List({ open }: { open: boolean }) {
			return (
				<Presence>
					{open && <p key="note" data-testid="note" exit={exitFade} />}
				</Presence>
			);
		}
		const { rerender, getByTestId } = render(<List open />);
		rerender(<List open={false} />);
		await waitFor(60);
		rerender(<List open />);
		await waitFor(300);
		const note = getByTestId("note");
		expect(note.hasAttribute("inert")).toBe(false);
		expect(getComputedStyle(note).opacity).toBe("1");
	});

	it("lets a first exit finish when a second child starts leaving", async () => {
		function slowFade(element: Element) {
			return animate(element, { opacity: 0 }, { type: "tween", duration: 0.4 });
		}
		function List({ shown }: { shown: string[] }) {
			return (
				<Presence>
					{shown.map((key) => (
						<p key={key} data-testid={key} exit={slowFade} />
					))}
				</Presence>
			);
		}
		const { rerender, queryByTestId } = render(<List shown={["a", "b"]} />);
		rerender(<List shown={["b"]} />);
		await waitFor(100);
		rerender(<List shown={[]} />);
		await waitFor(100);
		expect(queryByTestId("a")).not.toBeNull();
		await waitFor(500);
		expect(queryByTestId("a")).toBeNull();
		expect(queryByTestId("b")).toBeNull();
	});
});

describe("useTransform, more", () => {
	it("keeps following its source under StrictMode", () => {
		let source: MotionValue<number> | undefined;
		let double: MotionValue<number> | undefined;
		function Double() {
			source = useMotionValue(1);
			double = useTransform(source, (value: number) => value * 2);
			return null;
		}
		render(
			<React.StrictMode>
				<Double />
			</React.StrictMode>,
		);
		act(() => source?.set(4));
		expect(double?.get()).toBe(8);
	});

	it("maps through the ranges of the latest render", () => {
		let source: MotionValue<number> | undefined;
		let mapped: MotionValue<number> | undefined;
		function Mapped({ top }: { top: number }) {
			source = useMotionValue(0.5);
			mapped = useTransform(source, [0, 1], [0, top]);
			return null;
		}
		const { rerender } = render(<Mapped top={10} />);
		expect(mapped?.get()).toBe(5);
		rerender(<Mapped top={100} />);
		expect(mapped?.get()).toBe(50);
	});
});

describe("Presence refs", () => {
	it("keeps a child's callback ref attached across re-renders", () => {
		const calls: (Element | null)[] = [];
		function track(element: Element | null) {
			calls.push(element);
		}
		function List({ count }: { count: number }) {
			return (
				<Presence>
					<p key="note" ref={track}>
						{count}
					</p>
				</Presence>
			);
		}
		const { rerender } = render(<List count={1} />);
		rerender(<List count={2} />);
		rerender(<List count={3} />);
		expect(calls.filter((element) => element === null)).toHaveLength(0);
		expect(calls).toHaveLength(1);
	});
});
