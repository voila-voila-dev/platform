// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Avatar } from "#/avatar/components/avatar.tsx";

afterEach(cleanup);

describe("Avatar", () => {
	it("renders the fallback content", () => {
		const screen = render(
			<Avatar.Root>
				<Avatar.Fallback>CD</Avatar.Fallback>
			</Avatar.Root>,
		);
		expect(screen.getByText("CD")).toBeTruthy();
	});

	it("applies the default size as a data attribute", () => {
		const screen = render(
			<Avatar.Root>
				<Avatar.Fallback>CD</Avatar.Fallback>
			</Avatar.Root>,
		);
		const root = screen.baseElement.querySelector("[data-slot=avatar]");
		expect(root?.getAttribute("data-size")).toBe("default");
	});

	it.each([
		"sm",
		"default",
		"lg",
	] as const)("applies size %s as a data attribute", (size) => {
		const screen = render(
			<Avatar.Root size={size}>
				<Avatar.Fallback>CD</Avatar.Fallback>
			</Avatar.Root>,
		);
		const root = screen.baseElement.querySelector("[data-slot=avatar]");
		expect(root?.getAttribute("data-size")).toBe(size);
	});

	it("shows the fallback while the image has not loaded", () => {
		const screen = render(
			<Avatar.Root>
				<Avatar.Image src="https://acme.dev/missing.png" alt="Camille" />
				<Avatar.Fallback>CD</Avatar.Fallback>
			</Avatar.Root>,
		);
		expect(screen.getByText("CD")).toBeTruthy();
		expect(
			screen.baseElement.querySelector("[data-slot=avatar-image]"),
		).toBeNull();
	});

	it("merges className into the root and fallback", () => {
		const screen = render(
			<Avatar.Root className="custom-root-class">
				<Avatar.Fallback className="custom-fallback-class">CD</Avatar.Fallback>
			</Avatar.Root>,
		);
		const root = screen.baseElement.querySelector("[data-slot=avatar]");
		const fallback = screen.baseElement.querySelector(
			"[data-slot=avatar-fallback]",
		);
		expect(root?.classList.contains("custom-root-class")).toBe(true);
		expect(fallback?.classList.contains("custom-fallback-class")).toBe(true);
	});
});

describe("Avatar.Badge", () => {
	it("renders with the primary token when no status is given", () => {
		const screen = render(
			<Avatar.Root>
				<Avatar.Fallback>CD</Avatar.Fallback>
				<Avatar.Badge />
			</Avatar.Root>,
		);
		const badge = screen.baseElement.querySelector("[data-slot=avatar-badge]");
		expect(badge).not.toBeNull();
		expect(badge?.classList.contains("bg-primary")).toBe(true);
		expect(badge?.getAttribute("data-status")).toBeNull();
	});

	it.each([
		["online", "bg-success"],
		["offline", "bg-muted-foreground"],
		["busy", "bg-destructive"],
	] as const)("maps status %s to the %s token", (status, tokenClass) => {
		const screen = render(
			<Avatar.Root>
				<Avatar.Fallback>CD</Avatar.Fallback>
				<Avatar.Badge status={status} />
			</Avatar.Root>,
		);
		const badge = screen.baseElement.querySelector("[data-slot=avatar-badge]");
		expect(badge?.getAttribute("data-status")).toBe(status);
		expect(badge?.classList.contains(tokenClass)).toBe(true);
		expect(badge?.classList.contains("bg-primary")).toBe(false);
	});

	it("lets className override the status token", () => {
		const screen = render(
			<Avatar.Root>
				<Avatar.Fallback>CD</Avatar.Fallback>
				<Avatar.Badge status="online" className="bg-secondary" />
			</Avatar.Root>,
		);
		const badge = screen.baseElement.querySelector("[data-slot=avatar-badge]");
		expect(badge?.classList.contains("bg-secondary")).toBe(true);
		expect(badge?.classList.contains("bg-success")).toBe(false);
	});
});

describe("Avatar.Group", () => {
	it("renders its avatars and count", () => {
		const screen = render(
			<Avatar.Group>
				<Avatar.Root>
					<Avatar.Fallback>CD</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.Root>
					<Avatar.Fallback>NG</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.GroupCount aria-label="2 more participants">
					+2
				</Avatar.GroupCount>
			</Avatar.Group>,
		);
		const group = screen.baseElement.querySelector("[data-slot=avatar-group]");
		expect(group?.querySelectorAll("[data-slot=avatar]").length).toBe(2);
		expect(screen.getByLabelText("2 more participants")).toBeTruthy();
		expect(screen.getByText("+2")).toBeTruthy();
	});
});

describe("Avatar.GroupCount", () => {
	it("defaults to the default size", () => {
		const screen = render(<Avatar.GroupCount>+2</Avatar.GroupCount>);
		const count = screen.baseElement.querySelector(
			"[data-slot=avatar-group-count]",
		);
		expect(count?.getAttribute("data-size")).toBe("default");
	});

	it.each([
		"sm",
		"default",
		"lg",
	] as const)("applies size %s as a data attribute", (size) => {
		const screen = render(
			<Avatar.GroupCount size={size}>+2</Avatar.GroupCount>,
		);
		const count = screen.baseElement.querySelector(
			"[data-slot=avatar-group-count]",
		);
		expect(count?.getAttribute("data-size")).toBe(size);
	});

	it("does not inherit a size from sibling avatars", () => {
		const screen = render(
			<Avatar.Group>
				<Avatar.Root size="lg">
					<Avatar.Fallback>CD</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.GroupCount>+2</Avatar.GroupCount>
			</Avatar.Group>,
		);
		const count = screen.baseElement.querySelector(
			"[data-slot=avatar-group-count]",
		);
		expect(count?.getAttribute("data-size")).toBe("default");
		expect(count?.className.includes("group-has-data-[size=lg]")).toBe(false);
	});

	it("merges className", () => {
		const screen = render(
			<Avatar.GroupCount className="custom-count-class">+2</Avatar.GroupCount>,
		);
		const count = screen.baseElement.querySelector(
			"[data-slot=avatar-group-count]",
		);
		expect(count?.classList.contains("custom-count-class")).toBe(true);
	});
});
