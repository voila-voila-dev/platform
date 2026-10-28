// @vitest-environment node
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

describe("server rendering", () => {
	it("imports without a window and renders every hook without a warning", async () => {
		expect(typeof window).toBe("undefined");
		const error = vi.spyOn(console, "error");
		const warn = vi.spyOn(console, "warn");
		const motion = await import("#/react/index.ts");
		await import("#/index.ts");
		function Page() {
			const [scope] = motion.useAnimate<HTMLDivElement>();
			const x = motion.useMotionValue(0);
			const spring = motion.useSpring(10);
			const half = motion.useTransform(x, [0, 1], [0, 0.5]);
			const reduced = motion.useReducedMotion();
			return (
				<div ref={scope}>
					<motion.Presence>
						<p key="a">{`${spring.get()} ${half.get()} ${reduced}`}</p>
					</motion.Presence>
				</div>
			);
		}
		expect(renderToString(<Page />)).toContain("10 0 false");
		expect(error).not.toHaveBeenCalled();
		expect(warn).not.toHaveBeenCalled();
	});
});
