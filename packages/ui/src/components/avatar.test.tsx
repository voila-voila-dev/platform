// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
	Avatar,
	AvatarBadge,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
} from "#/components/avatar.tsx";

afterEach(cleanup);

describe("Avatar", () => {
	it("renders the fallback content", () => {
		const screen = render(
			<Avatar>
				<AvatarFallback>CD</AvatarFallback>
			</Avatar>,
		);
		expect(screen.getByText("CD")).toBeTruthy();
	});

	it("applies the default size as a data attribute", () => {
		const screen = render(
			<Avatar>
				<AvatarFallback>CD</AvatarFallback>
			</Avatar>,
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
			<Avatar size={size}>
				<AvatarFallback>CD</AvatarFallback>
			</Avatar>,
		);
		const root = screen.baseElement.querySelector("[data-slot=avatar]");
		expect(root?.getAttribute("data-size")).toBe(size);
	});

	it("shows the fallback while the image has not loaded", () => {
		const screen = render(
			<Avatar>
				<AvatarImage src="https://acme.dev/missing.png" alt="Camille" />
				<AvatarFallback>CD</AvatarFallback>
			</Avatar>,
		);
		expect(screen.getByText("CD")).toBeTruthy();
		expect(
			screen.baseElement.querySelector("[data-slot=avatar-image]"),
		).toBeNull();
	});

	it("merges className into the root and fallback", () => {
		const screen = render(
			<Avatar className="custom-root-class">
				<AvatarFallback className="custom-fallback-class">CD</AvatarFallback>
			</Avatar>,
		);
		const root = screen.baseElement.querySelector("[data-slot=avatar]");
		const fallback = screen.baseElement.querySelector(
			"[data-slot=avatar-fallback]",
		);
		expect(root?.classList.contains("custom-root-class")).toBe(true);
		expect(fallback?.classList.contains("custom-fallback-class")).toBe(true);
	});
});

describe("AvatarBadge", () => {
	it("renders with the primary token when no status is given", () => {
		const screen = render(
			<Avatar>
				<AvatarFallback>CD</AvatarFallback>
				<AvatarBadge />
			</Avatar>,
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
			<Avatar>
				<AvatarFallback>CD</AvatarFallback>
				<AvatarBadge status={status} />
			</Avatar>,
		);
		const badge = screen.baseElement.querySelector("[data-slot=avatar-badge]");
		expect(badge?.getAttribute("data-status")).toBe(status);
		expect(badge?.classList.contains(tokenClass)).toBe(true);
		expect(badge?.classList.contains("bg-primary")).toBe(false);
	});

	it("lets className override the status token", () => {
		const screen = render(
			<Avatar>
				<AvatarFallback>CD</AvatarFallback>
				<AvatarBadge status="online" className="bg-secondary" />
			</Avatar>,
		);
		const badge = screen.baseElement.querySelector("[data-slot=avatar-badge]");
		expect(badge?.classList.contains("bg-secondary")).toBe(true);
		expect(badge?.classList.contains("bg-success")).toBe(false);
	});
});

describe("AvatarGroup", () => {
	it("renders its avatars and count", () => {
		const screen = render(
			<AvatarGroup>
				<Avatar>
					<AvatarFallback>CD</AvatarFallback>
				</Avatar>
				<Avatar>
					<AvatarFallback>NG</AvatarFallback>
				</Avatar>
				<AvatarGroupCount aria-label="2 more participants">+2</AvatarGroupCount>
			</AvatarGroup>,
		);
		const group = screen.baseElement.querySelector("[data-slot=avatar-group]");
		expect(group?.querySelectorAll("[data-slot=avatar]").length).toBe(2);
		expect(screen.getByLabelText("2 more participants")).toBeTruthy();
		expect(screen.getByText("+2")).toBeTruthy();
	});
});

describe("AvatarGroupCount", () => {
	it("defaults to the default size", () => {
		const screen = render(<AvatarGroupCount>+2</AvatarGroupCount>);
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
		const screen = render(<AvatarGroupCount size={size}>+2</AvatarGroupCount>);
		const count = screen.baseElement.querySelector(
			"[data-slot=avatar-group-count]",
		);
		expect(count?.getAttribute("data-size")).toBe(size);
	});

	it("does not inherit a size from sibling avatars", () => {
		const screen = render(
			<AvatarGroup>
				<Avatar size="lg">
					<AvatarFallback>CD</AvatarFallback>
				</Avatar>
				<AvatarGroupCount>+2</AvatarGroupCount>
			</AvatarGroup>,
		);
		const count = screen.baseElement.querySelector(
			"[data-slot=avatar-group-count]",
		);
		expect(count?.getAttribute("data-size")).toBe("default");
		expect(count?.className.includes("group-has-data-[size=lg]")).toBe(false);
	});

	it("merges className", () => {
		const screen = render(
			<AvatarGroupCount className="custom-count-class">+2</AvatarGroupCount>,
		);
		const count = screen.baseElement.querySelector(
			"[data-slot=avatar-group-count]",
		);
		expect(count?.classList.contains("custom-count-class")).toBe(true);
	});
});
