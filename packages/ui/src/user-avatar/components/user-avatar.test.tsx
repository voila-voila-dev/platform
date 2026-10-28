// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { UserAvatar } from "#/user-avatar/components/user-avatar.tsx";

afterEach(cleanup);

function queryRow(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelector("[data-slot=user-avatar]");
}

describe("UserAvatar", () => {
	it("renders the name and derived initials fallback", () => {
		const screen = render(<UserAvatar name="Camille Dubois" />);
		const row = queryRow(screen);
		expect(
			row?.querySelector("[data-slot=user-avatar-name]")?.textContent,
		).toBe("Camille Dubois");
		expect(row?.querySelector("[data-slot=avatar-fallback]")?.textContent).toBe(
			"CD",
		);
	});

	it("renders the description line when provided", () => {
		const screen = render(
			<UserAvatar name="Camille Dubois" description="Product designer" />,
		);
		expect(
			queryRow(screen)?.querySelector("[data-slot=user-avatar-description]")
				?.textContent,
		).toBe("Product designer");
	});

	it("omits the description line when not provided", () => {
		const screen = render(<UserAvatar name="Camille Dubois" />);
		expect(
			queryRow(screen)?.querySelector("[data-slot=user-avatar-description]"),
		).toBeNull();
	});

	it("renders the status badge only when a status is passed", () => {
		const withStatus = render(
			<UserAvatar name="Camille Dubois" status="online" />,
		);
		expect(
			queryRow(withStatus)
				?.querySelector("[data-slot=avatar-badge]")
				?.getAttribute("data-status"),
		).toBe("online");
		cleanup();
		const withoutStatus = render(<UserAvatar name="Camille Dubois" />);
		expect(
			queryRow(withoutStatus)?.querySelector("[data-slot=avatar-badge]"),
		).toBeNull();
	});

	it("forwards the size to the avatar and exposes it as a data attribute", () => {
		const screen = render(<UserAvatar name="Camille Dubois" size="lg" />);
		const row = queryRow(screen);
		expect(row?.getAttribute("data-size")).toBe("lg");
		expect(
			row?.querySelector("[data-slot=avatar]")?.getAttribute("data-size"),
		).toBe("lg");
	});

	it("merges className on the root", () => {
		const screen = render(
			<UserAvatar name="Camille Dubois" className="custom-row" />,
		);
		expect(queryRow(screen)?.classList.contains("custom-row")).toBe(true);
	});
});
