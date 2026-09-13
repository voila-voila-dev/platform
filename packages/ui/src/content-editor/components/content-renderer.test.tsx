// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ContentRenderer } from "#/content-editor/components/content-renderer.tsx";
import { createContentReaders } from "#/content-editor/reader/readers.ts";

afterEach(cleanup);

describe("ContentRenderer", () => {
	it("renders the same structure the HTML serializer emits", () => {
		const { container } = render(
			<ContentRenderer
				features={createContentReaders()}
				value={[
					{ type: "h2", id: "t", children: [{ text: "Title" }] },
					{
						type: "p",
						listStyleType: "disc",
						children: [{ text: "one", bold: true }],
					},
					{ type: "p", listStyleType: "disc", children: [{ text: "two" }] },
					{
						type: "image",
						url: "https://i/1.png",
						caption: "Cap",
						children: [{ text: "" }],
					},
				]}
			/>,
		);
		const root = container.firstElementChild as HTMLElement;
		expect(root.dataset.slot).toBe("content-renderer");
		expect(root.querySelector("h2#t")?.textContent).toBe("Title");
		expect(root.querySelectorAll("ul > li")).toHaveLength(2);
		expect(root.querySelector("ul > li > strong")?.textContent).toBe("one");
		expect(root.querySelector("figure img")?.getAttribute("alt")).toBe("Cap");
		expect(root.querySelector("figcaption")?.textContent).toBe("Cap");
	});

	it("renders nothing for an empty value and takes a render override", () => {
		const { container } = render(
			<ContentRenderer
				features={createContentReaders()}
				value={null}
				render={<article />}
			/>,
		);
		expect(container.firstElementChild?.tagName).toBe("ARTICLE");
		expect(container.firstElementChild?.childElementCount).toBe(0);
	});
});
