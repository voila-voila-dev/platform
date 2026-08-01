// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Attachment } from "#/attachment/components/attachment.tsx";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
	return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

describe("Attachment", () => {
	it("renders its children in a div by default", () => {
		const screen = render(<Attachment.Root>report.pdf</Attachment.Root>);
		const attachment = queryBySlot(screen, "attachment");
		expect(attachment?.tagName).toBe("DIV");
		expect(attachment?.textContent).toBe("report.pdf");
	});

	it("exposes the default state, size and orientation as data attributes", () => {
		const screen = render(<Attachment.Root>report.pdf</Attachment.Root>);
		const attachment = queryBySlot(screen, "attachment");
		expect(attachment?.getAttribute("data-state")).toBe("done");
		expect(attachment?.getAttribute("data-size")).toBe("default");
		expect(attachment?.getAttribute("data-orientation")).toBe("horizontal");
	});

	it.each([
		"idle",
		"uploading",
		"processing",
		"error",
		"done",
	] as const)("exposes state %s as a data attribute", (state) => {
		const screen = render(
			<Attachment.Root state={state}>report.pdf</Attachment.Root>,
		);
		expect(queryBySlot(screen, "attachment")?.getAttribute("data-state")).toBe(
			state,
		);
	});

	it("renders every part with its slot", () => {
		const screen = render(
			<Attachment.Group>
				<Attachment.Root>
					<Attachment.Media>icon</Attachment.Media>
					<Attachment.Content>
						<Attachment.Title>report.pdf</Attachment.Title>
						<Attachment.Description>PDF · 2.4 MB</Attachment.Description>
					</Attachment.Content>
					<Attachment.Actions>
						<Attachment.Action aria-label="Remove">x</Attachment.Action>
					</Attachment.Actions>
					<Attachment.Trigger aria-label="Open report.pdf" />
				</Attachment.Root>
			</Attachment.Group>,
		);
		for (const slot of [
			"attachment-group",
			"attachment",
			"attachment-media",
			"attachment-content",
			"attachment-title",
			"attachment-description",
			"attachment-actions",
			"attachment-action",
			"attachment-trigger",
		]) {
			expect(queryBySlot(screen, slot), slot).not.toBeNull();
		}
	});

	it("renders the trigger as a type=button by default", () => {
		const screen = render(
			<Attachment.Root>
				<Attachment.Trigger aria-label="Open" />
			</Attachment.Root>,
		);
		const trigger = queryBySlot(screen, "attachment-trigger");
		expect(trigger?.tagName).toBe("BUTTON");
		expect(trigger?.getAttribute("type")).toBe("button");
	});

	it("retargets the trigger through render", () => {
		const screen = render(
			<Attachment.Root>
				<Attachment.Trigger render={<a href="#file">Open file</a>} />
			</Attachment.Root>,
		);
		const trigger = queryBySlot(screen, "attachment-trigger");
		expect(trigger?.tagName).toBe("A");
		expect(trigger?.hasAttribute("type")).toBe(false);
	});
});
