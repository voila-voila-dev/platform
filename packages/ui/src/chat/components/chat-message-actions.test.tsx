// @vitest-environment jsdom
import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Chat } from "#/chat/components/chat.tsx";

afterEach(() => {
	cleanup();
	vi.useRealTimers();
	Reflect.deleteProperty(window, "matchMedia");
});

/** jsdom has no matchMedia; answer as one kind of pointer or the other. */
function mockPointer(kind: "fine" | "coarse") {
	window.matchMedia = ((query: string) =>
		({
			matches:
				kind === "fine"
					? query.includes("hover: hover")
					: query.includes("hover: none"),
			media: query,
			addEventListener: () => {},
			removeEventListener: () => {},
		}) as unknown as MediaQueryList) as typeof window.matchMedia;
}

const trigger = () => screen.getByText("hello").parentElement as HTMLElement;

function longPress(target: HTMLElement) {
	fireEvent.touchStart(target, {
		touches: [{ clientX: 20, clientY: 20 }],
	});
	act(() => {
		vi.advanceTimersByTime(600);
	});
}

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

describe("Chat.Reactions", () => {
	it("keeps the pill in the flow so it pushes the next message", () => {
		render(
			<Chat.Reactions>
				<Chat.Reaction emoji="👍" />
			</Chat.Reactions>,
		);
		const pill = document.querySelector<HTMLElement>(
			"[data-slot=chat-reactions]",
		);
		expect(pill).not.toBeNull();
		expect(pill?.className).not.toContain("absolute");
		expect(pill?.className).toContain("order-last");
	});

	it("mirrors the layout on the top side", () => {
		render(<Chat.Reactions side="top" />);
		const pill = document.querySelector<HTMLElement>(
			"[data-slot=chat-reactions]",
		);
		expect(pill?.className).toContain("order-first");
	});
});

describe("Chat.MessageActions hover bar", () => {
	it("appears when a fine pointer hovers the message", () => {
		mockPointer("fine");
		render(
			<Chat.MessageActions onReact={() => {}} reactionsLabel="React">
				<span>hello</span>
			</Chat.MessageActions>,
		);
		fireEvent.pointerEnter(trigger());
		expect(screen.getByLabelText("React")).toBeTruthy();
		expect(screen.getByRole("button", { name: "👍" })).toBeTruthy();
	});

	it("stays away from a coarse pointer", () => {
		mockPointer("coarse");
		render(
			<Chat.MessageActions onReact={() => {}} reactionsLabel="React">
				<span>hello</span>
			</Chat.MessageActions>,
		);
		fireEvent.pointerEnter(trigger());
		expect(screen.queryByLabelText("React")).toBeNull();
	});

	it("reports the emoji tapped from the bar", () => {
		mockPointer("fine");
		const onReact = vi.fn();
		render(
			<Chat.MessageActions onReact={onReact} emojis={["👍"]}>
				<span>hello</span>
			</Chat.MessageActions>,
		);
		fireEvent.pointerEnter(trigger());
		fireEvent.click(screen.getByRole("button", { name: "👍" }));
		expect(onReact).toHaveBeenCalledWith("👍");
	});

	it("shows an icon action as an icon-only button, and runs it", () => {
		mockPointer("fine");
		const onCopy = vi.fn();
		render(
			<Chat.MessageActions
				actions={
					<Chat.MessageAction icon={<svg aria-hidden />} onClick={onCopy}>
						Copy
					</Chat.MessageAction>
				}
			>
				<span>hello</span>
			</Chat.MessageActions>,
		);
		fireEvent.pointerEnter(trigger());
		const action = screen.getByRole("button", { name: "Copy" });
		expect(action.textContent).toBe("");
		fireEvent.click(action);
		expect(onCopy).toHaveBeenCalled();
		expect(screen.queryByRole("button", { name: "Copy" })).toBeNull();
	});

	it("keeps an action without an icon out of the bar", () => {
		mockPointer("fine");
		render(
			<Chat.MessageActions
				actions={<Chat.MessageAction>Copy</Chat.MessageAction>}
			>
				<span>hello</span>
			</Chat.MessageActions>,
		);
		fireEvent.pointerEnter(trigger());
		expect(screen.queryByText("Copy")).toBeNull();
	});
});

describe("Chat.MessageActions long press", () => {
	it("lifts the message into the full-screen surface", () => {
		vi.useFakeTimers();
		mockPointer("coarse");
		render(
			<Chat.MessageActions
				onReact={() => {}}
				reactionsLabel="React"
				menuLabel="Actions"
				actions={<Chat.MessageAction>Copy</Chat.MessageAction>}
			>
				<span>hello</span>
			</Chat.MessageActions>,
		);
		longPress(screen.getByText("hello"));
		expect(screen.getByRole("dialog")).toBeTruthy();
		expect(screen.getByLabelText("React")).toBeTruthy();
		// The action renders as a real button here, not a menu item.
		expect(screen.getByRole("button", { name: "Copy" })).toBeTruthy();
	});

	it("cancels when the finger drifts before the delay", () => {
		vi.useFakeTimers();
		mockPointer("coarse");
		render(
			<Chat.MessageActions
				onReact={() => {}}
				menuLabel="Actions"
				actions={<Chat.MessageAction>Copy</Chat.MessageAction>}
			>
				<span>hello</span>
			</Chat.MessageActions>,
		);
		const target = screen.getByText("hello");
		fireEvent.touchStart(target, {
			touches: [{ clientX: 20, clientY: 20 }],
		});
		fireEvent.touchMove(target, {
			touches: [{ clientX: 20, clientY: 60 }],
		});
		act(() => {
			vi.advanceTimersByTime(600);
		});
		expect(screen.queryByRole("dialog")).toBeNull();
	});

	it("closes once an action has been tapped", () => {
		vi.useFakeTimers();
		mockPointer("coarse");
		const onCopy = vi.fn();
		render(
			<Chat.MessageActions
				menuLabel="Actions"
				actions={<Chat.MessageAction onClick={onCopy}>Copy</Chat.MessageAction>}
			>
				<span>hello</span>
			</Chat.MessageActions>,
		);
		longPress(screen.getByText("hello"));
		fireEvent.click(screen.getByRole("button", { name: "Copy" }));
		expect(onCopy).toHaveBeenCalled();
		act(() => {
			vi.runAllTimers();
		});
		expect(screen.queryByRole("dialog")).toBeNull();
	});
});
