// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EmojiPicker } from "#/emoji-picker/components/emoji-picker.tsx";

beforeEach(() => {
	// frimousse sizes its rows with ResizeObserver, absent in jsdom.
	vi.stubGlobal(
		"ResizeObserver",
		class {
			observe() {}
			unobserve() {}
			disconnect() {}
		},
	);
});

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

function stubFetch() {
	const fetch = vi.fn((_url: string) => new Promise<Response>(() => {}));
	vi.stubGlobal("fetch", fetch);
	return fetch;
}

describe("EmojiPicker", () => {
	it("reads the emoji data of its locale from emoji.voila.dev", async () => {
		const fetch = stubFetch();
		render(<EmojiPicker onEmojiSelect={() => {}} locale="fr" />);
		await vi.waitFor(() =>
			expect(fetch.mock.calls.map(([url]) => String(url))).toContain(
				"https://emoji.voila.dev/emojibase-data/17.0.0/fr/data.json",
			),
		);
	});

	it("reads it from the address it is given", async () => {
		const fetch = stubFetch();
		render(
			<EmojiPicker
				onEmojiSelect={() => {}}
				locale="en"
				emojibaseUrl="https://cdn.example.test/emojibase"
			/>,
		);
		await vi.waitFor(() =>
			expect(fetch.mock.calls.map(([url]) => String(url))).toContain(
				"https://cdn.example.test/emojibase/en/data.json",
			),
		);
	});

	it("shows the consumer's copy while the data loads", () => {
		stubFetch();
		const screen = render(
			<EmojiPicker
				onEmojiSelect={() => {}}
				searchPlaceholder="Rechercher un emoji"
				loadingLabel="Chargement…"
			/>,
		);
		expect(screen.getByPlaceholderText("Rechercher un emoji")).toBeTruthy();
		expect(screen.getByText("Chargement…")).toBeTruthy();
	});

	it("focuses the search only when asked", () => {
		stubFetch();
		const screen = render(
			<EmojiPicker onEmojiSelect={() => {}} searchPlaceholder="Search" />,
		);
		expect(document.activeElement).not.toBe(
			screen.getByPlaceholderText("Search"),
		);
		cleanup();
		const focused = render(
			<EmojiPicker
				onEmojiSelect={() => {}}
				searchPlaceholder="Search"
				autoFocus
			/>,
		);
		expect(document.activeElement).toBe(focused.getByPlaceholderText("Search"));
	});
});
