// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { LogoMarquee } from "#/landing/components/logo-marquee.tsx";

afterEach(cleanup);

describe("LogoMarquee", () => {
	it("duplicates the track children with the clone hidden from assistive tech", () => {
		const screen = render(
			<LogoMarquee.Root>
				<LogoMarquee.Title>Trusted by leading teams</LogoMarquee.Title>
				<LogoMarquee.Viewport>
					<LogoMarquee.Track>
						<LogoMarquee.Item src="/a.png" alt="Client A" />
						<LogoMarquee.Item src="/b.png" alt="Client B" />
					</LogoMarquee.Track>
				</LogoMarquee.Viewport>
			</LogoMarquee.Root>,
		);

		const images = screen.container.querySelectorAll("img");
		expect(images.length).toBe(4);
		expect(screen.getAllByAltText("Client A").length).toBe(2);

		const clone = screen.container.querySelector("[aria-hidden=true]");
		expect(clone?.classList.contains("contents")).toBe(true);
		expect(clone?.querySelectorAll("img").length).toBe(2);
	});

	it("honors a custom loop duration", () => {
		const screen = render(
			<LogoMarquee.Track duration={12}>
				<LogoMarquee.Item src="/a.png" alt="Client A" />
			</LogoMarquee.Track>,
		);
		const track = screen.container.querySelector(
			"[data-slot=logo-marquee-track]",
		) as HTMLElement;
		expect(track.style.animationDuration).toBe("12s");
	});
});
