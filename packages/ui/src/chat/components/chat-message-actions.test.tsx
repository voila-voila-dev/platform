// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Chat } from "#/chat/components/chat.tsx";

afterEach(cleanup);

const openMenu = () => {
	fireEvent.contextMenu(screen.getByText("hello"));
};

describe("Chat.MessageActions", () => {
	it("opens on right-click and offers the quick reactions", () => {
		render(
			<Chat.MessageActions onReact={() => {}} reactionsLabel="React">
				<span>hello</span>
			</Chat.MessageActions>,
		);
		expect(screen.queryByLabelText("React")).toBeNull();

		openMenu();
		expect(screen.getByLabelText("React")).toBeTruthy();
		expect(screen.getAllByRole("button", { pressed: false })).toHaveLength(6);
	});

	it("reports the emoji tapped, and leaves the toggling to the caller", () => {
		const onReact = vi.fn();
		render(
			<Chat.MessageActions onReact={onReact} emojis={["👍", "❤️"]}>
				<span>hello</span>
			</Chat.MessageActions>,
		);
		openMenu();
		fireEvent.click(screen.getByRole("button", { name: "👍" }));
		expect(onReact).toHaveBeenCalledWith("👍");
	});

	it("shows the reader's own reactions as pressed", () => {
		render(
			<Chat.MessageActions
				onReact={() => {}}
				emojis={["👍", "❤️"]}
				activeEmojis={["❤️"]}
			>
				<span>hello</span>
			</Chat.MessageActions>,
		);
		openMenu();
		expect(screen.getByRole("button", { name: "❤️" }).ariaPressed).toBe("true");
		expect(screen.getByRole("button", { name: "👍" }).ariaPressed).toBe(
			"false",
		);
	});

	it("drops the row when there is nothing to react with", () => {
		render(
			<Chat.MessageActions emojis={[]} reactionsLabel="React">
				<span>hello</span>
			</Chat.MessageActions>,
		);
		openMenu();
		expect(screen.queryByLabelText("React")).toBeNull();
	});

	it("renders the caller's actions, destructive ones marked as such", () => {
		render(
			<Chat.MessageActions
				actions={
					<>
						<Chat.MessageAction>Copy</Chat.MessageAction>
						<Chat.MessageAction variant="destructive">
							Delete
						</Chat.MessageAction>
					</>
				}
			>
				<span>hello</span>
			</Chat.MessageActions>,
		);
		openMenu();
		expect(screen.getByText("Copy")).toBeTruthy();
		expect(screen.getByText("Delete").dataset.variant).toBe("destructive");
	});
});

describe("Chat.Reaction", () => {
	it("hides the count of a lone reaction, shows it from two", () => {
		const { rerender } = render(<Chat.Reaction emoji="👍" count={1} />);
		expect(screen.getByRole("button").textContent).toBe("👍");

		rerender(<Chat.Reaction emoji="👍" count={4} />);
		expect(screen.getByRole("button").textContent).toBe("👍4");
	});

	it("says whether the reader is one of them", () => {
		render(<Chat.Reaction emoji="👍" active />);
		expect(screen.getByRole("button").ariaPressed).toBe("true");
	});
});
