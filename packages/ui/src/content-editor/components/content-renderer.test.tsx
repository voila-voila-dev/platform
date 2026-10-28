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

	it("renders bare elements when unstyled, and the same fixes as the HTML", () => {
		const { container } = render(
			<ContentRenderer
				features={createContentReaders()}
				options={{ unstyled: true, siteOrigin: "https://example.com" }}
				value={[
					{ type: "h2", children: [{ text: "Title" }] },
					{
						type: "blockquote",
						children: [
							{ type: "p", listStyleType: "disc", children: [{ text: "a" }] },
						],
					},
					{
						type: "p",
						children: [
							{ type: "a", url: "/in", children: [{ text: "in" }] },
							{
								type: "a",
								url: "https://other.org",
								children: [{ text: "out" }],
							},
						],
					},
					{
						type: "table",
						children: [
							{
								type: "tr",
								children: [
									{
										type: "th",
										children: [{ type: "p", children: [{ text: "H" }] }],
									},
								],
							},
							{
								type: "tr",
								children: [
									{
										type: "td",
										children: [{ type: "p", children: [{ text: "D" }] }],
									},
								],
							},
						],
					},
					{
						type: "code_block",
						children: [
							{ type: "code_line", children: [{ text: "a" }] },
							{ type: "code_line", children: [{ text: "b" }] },
						],
					},
				]}
			/>,
		);
		const root = container.firstElementChild as HTMLElement;
		expect(root.getAttribute("class")).toBeNull();
		expect(root.querySelectorAll("[class]")).toHaveLength(1);
		expect(root.querySelector("[class]")?.className).toBe("overflow-x-auto");
		expect(root.querySelector("blockquote > ul > li")?.textContent).toBe("a");
		const [inside, outside] = root.querySelectorAll("a");
		expect(inside?.hasAttribute("rel")).toBe(false);
		expect(outside?.getAttribute("rel")).toBe("noopener noreferrer");
		expect(root.querySelector("thead > tr > th")?.innerHTML).toBe("H");
		expect(root.querySelector("tbody > tr > td")?.innerHTML).toBe("D");
		expect(root.querySelector("pre > code")?.textContent).toBe("a\nb");
	});

	it("keeps the kit's classes by default", () => {
		const { container } = render(
			<ContentRenderer
				features={createContentReaders()}
				value={[{ type: "h2", children: [{ text: "Title" }] }]}
			/>,
		);
		expect(container.querySelector("h2")?.className).toContain("font-semibold");
	});
});
