// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	ChatComposer,
	ChatConversationItem,
	ChatDateSeparator,
	ChatExternalLinkDialog,
	ChatMessage,
	ChatMessageGroup,
	ChatMessageList,
	ChatMessageSender,
	ChatMessageText,
	ChatMessageTime,
	ChatUnreadSeparator,
} from "#/components/chat.tsx";

afterEach(cleanup);

function queryBySlot(screen: ReturnType<typeof render>, slot: string) {
	return screen.baseElement.querySelector(`[data-slot=${slot}]`);
}

/** Give a jsdom element real-looking scroll metrics (jsdom reports 0). */
function defineScrollMetrics(
	node: HTMLElement,
	metrics: { scrollHeight: number; clientHeight: number },
) {
	Object.defineProperty(node, "scrollHeight", {
		value: metrics.scrollHeight,
		configurable: true,
	});
	Object.defineProperty(node, "clientHeight", {
		value: metrics.clientHeight,
		configurable: true,
	});
}

describe("ChatMessageList", () => {
	it("renders the header and children inside the scroll slot", () => {
		const screen = render(
			<ChatMessageList header={<button type="button">Load older</button>}>
				<p>Bonjour</p>
			</ChatMessageList>,
		);
		const list = queryBySlot(screen, "chat-message-list");
		expect(list?.tagName).toBe("DIV");
		expect(screen.getByText("Load older")).toBeTruthy();
		expect(screen.getByText("Bonjour")).toBeTruthy();
	});

	it("announces new messages politely to screen readers", () => {
		const screen = render(<ChatMessageList>x</ChatMessageList>);
		const list = queryBySlot(screen, "chat-message-list");
		expect(list?.getAttribute("role")).toBe("log");
		expect(list?.getAttribute("aria-live")).toBe("polite");
	});

	it("scrolls to the bottom on first mount", () => {
		const screen = render(
			<ChatMessageList>
				<p>Latest</p>
			</ChatMessageList>,
		);
		const list = queryBySlot(screen, "chat-message-list") as HTMLDivElement;
		// jsdom reports 0 for layout metrics; the effect still assigns scrollTop
		// from scrollHeight, so the two end up equal (the "land at bottom" intent).
		expect(list.scrollTop).toBe(list.scrollHeight);
	});

	it("notifies onFollowChange when the reader scrolls away from the bottom", () => {
		const onFollowChange = vi.fn();
		const screen = render(
			<ChatMessageList onFollowChange={onFollowChange}>
				<p>History</p>
			</ChatMessageList>,
		);
		const list = queryBySlot(screen, "chat-message-list") as HTMLDivElement;
		// Simulate a tall thread scrolled to the very top (far from the bottom).
		defineScrollMetrics(list, { scrollHeight: 1000, clientHeight: 200 });
		list.scrollTop = 0;
		fireEvent.scroll(list);
		expect(onFollowChange).toHaveBeenCalledWith(false);
	});

	it("honours a custom followThreshold", () => {
		const onFollowChange = vi.fn();
		const screen = render(
			<ChatMessageList onFollowChange={onFollowChange} followThreshold={500}>
				<p>History</p>
			</ChatMessageList>,
		);
		const list = queryBySlot(screen, "chat-message-list") as HTMLDivElement;
		// 300px from the bottom: outside the default 48px, inside the custom 500px.
		defineScrollMetrics(list, { scrollHeight: 1000, clientHeight: 200 });
		list.scrollTop = 500;
		fireEvent.scroll(list);
		expect(onFollowChange).not.toHaveBeenCalled();
	});

	it("does not yank the reader down when a message arrives while reading history", () => {
		const screen = render(
			<ChatMessageList>{[<p key="a">Premier</p>]}</ChatMessageList>,
		);
		const list = queryBySlot(screen, "chat-message-list") as HTMLDivElement;
		defineScrollMetrics(list, { scrollHeight: 1000, clientHeight: 200 });
		// Reading history: far from the bottom.
		list.scrollTop = 100;
		fireEvent.scroll(list);
		screen.rerender(
			<ChatMessageList>
				{[<p key="a">Premier</p>, <p key="b">Nouveau</p>]}
			</ChatMessageList>,
		);
		expect(list.scrollTop).toBe(100);
	});

	it("preserves the viewport on prepend when native scroll anchoring is missing", () => {
		const screen = render(
			<ChatMessageList>{[<p key="a">Anchored</p>]}</ChatMessageList>,
		);
		const list = queryBySlot(screen, "chat-message-list") as HTMLDivElement;
		defineScrollMetrics(list, { scrollHeight: 1000, clientHeight: 200 });
		// Re-run the effect so it records the 1000px height as the baseline.
		screen.rerender(
			<ChatMessageList>{[<p key="a">Anchored</p>]}</ChatMessageList>,
		);
		list.scrollTop = 100;
		fireEvent.scroll(list);
		// Loading older history grows the content above the anchored message.
		defineScrollMetrics(list, { scrollHeight: 1400, clientHeight: 200 });
		screen.rerender(
			<ChatMessageList>
				{[<p key="older">Older</p>, <p key="a">Anchored</p>]}
			</ChatMessageList>,
		);
		// jsdom (like Safari) lacks overflow-anchor: the list compensates by the
		// 400px height delta so the reader stays on the same message.
		expect(list.scrollTop).toBe(500);
	});

	it("shows a jump-to-latest button while away from the bottom and jumps on click", () => {
		const screen = render(
			<ChatMessageList jumpToLatestLabel="Nouveaux messages">
				<p>History</p>
			</ChatMessageList>,
		);
		const list = queryBySlot(screen, "chat-message-list") as HTMLDivElement;
		expect(queryBySlot(screen, "chat-jump-to-latest")).toBeNull();
		defineScrollMetrics(list, { scrollHeight: 1000, clientHeight: 200 });
		list.scrollTop = 0;
		fireEvent.scroll(list);
		const button = screen.getByRole("button", { name: "Nouveaux messages" });
		fireEvent.click(button);
		expect(list.scrollTop).toBe(1000);
		expect(queryBySlot(screen, "chat-jump-to-latest")).toBeNull();
	});

	it("renders no jump-to-latest affordance without a label", () => {
		const screen = render(<ChatMessageList>x</ChatMessageList>);
		const list = queryBySlot(screen, "chat-message-list") as HTMLDivElement;
		defineScrollMetrics(list, { scrollHeight: 1000, clientHeight: 200 });
		list.scrollTop = 0;
		fireEvent.scroll(list);
		expect(queryBySlot(screen, "chat-jump-to-latest")).toBeNull();
	});

	it("opts into a dark color-scheme so the native scrollbar matches the theme", () => {
		const screen = render(<ChatMessageList>x</ChatMessageList>);
		const list = queryBySlot(screen, "chat-message-list");
		expect(list?.classList.contains("dark:scheme-dark")).toBe(true);
	});
});

describe("ChatMessageGroup", () => {
	it("exposes the alignment as data-align and carries the group marker", () => {
		const screen = render(<ChatMessageGroup align="end">x</ChatMessageGroup>);
		const group = queryBySlot(screen, "chat-message-group");
		expect(group?.getAttribute("data-align")).toBe("end");
		// `group` is what lets group-data-[align=end]:* on ChatMessageTime match.
		expect(group?.classList.contains("group")).toBe(true);
		expect(group?.classList.contains("items-end")).toBe(true);
	});

	it("left-aligns a start group", () => {
		const screen = render(<ChatMessageGroup align="start">x</ChatMessageGroup>);
		expect(
			queryBySlot(screen, "chat-message-group")?.classList.contains(
				"items-start",
			),
		).toBe(true);
	});
});

describe("ChatMessage", () => {
	it("exposes the variant as a data attribute with its bubble classes", () => {
		const screen = render(<ChatMessage variant="own">Salut</ChatMessage>);
		const message = queryBySlot(screen, "chat-message");
		expect(message?.getAttribute("data-variant")).toBe("own");
		expect(message?.classList.contains("bg-primary")).toBe(true);
	});

	it("renders the other variant with the muted bubble", () => {
		const screen = render(<ChatMessage variant="other">Bonjour</ChatMessage>);
		const message = queryBySlot(screen, "chat-message");
		expect(message?.getAttribute("data-variant")).toBe("other");
		expect(message?.classList.contains("bg-muted")).toBe(true);
	});

	it("wraps unbroken words/URLs instead of overflowing the bubble", () => {
		const screen = render(
			<ChatMessage variant="other">
				https://example.com/une-url-tres-longue-sans-espace
			</ChatMessage>,
		);
		const message = queryBySlot(screen, "chat-message");
		expect(message?.classList.contains("min-w-0")).toBe(true);
		expect(message?.classList.contains("[overflow-wrap:anywhere]")).toBe(true);
	});

	it("animates in but respects reduced motion", () => {
		const screen = render(<ChatMessage variant="own">x</ChatMessage>);
		const message = queryBySlot(screen, "chat-message");
		expect(message?.classList.contains("animate-in")).toBe(true);
		expect(message?.classList.contains("motion-reduce:animate-none")).toBe(
			true,
		);
	});
});

describe("ChatMessageText", () => {
	it("turns URLs into links opening in a new tab and keeps surrounding text", () => {
		const screen = render(
			<ChatMessageText>
				Voici le lien : https://example.com/protocole pour samedi.
			</ChatMessageText>,
		);
		const link = screen.baseElement.querySelector("a");
		expect(link?.getAttribute("href")).toBe("https://example.com/protocole");
		expect(link?.getAttribute("target")).toBe("_blank");
		expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
		expect(queryBySlot(screen, "chat-message-text")?.textContent).toContain(
			"pour samedi.",
		);
	});

	it("leaves trailing sentence punctuation out of the URL", () => {
		const screen = render(
			<ChatMessageText>Regarde https://example.com/page.</ChatMessageText>,
		);
		const link = screen.baseElement.querySelector("a");
		expect(link?.getAttribute("href")).toBe("https://example.com/page");
	});

	it("renders plain text untouched when there is no URL", () => {
		const screen = render(<ChatMessageText>Hello everyone</ChatMessageText>);
		expect(screen.baseElement.querySelector("a")).toBeNull();
		expect(screen.getByText("Hello everyone")).toBeTruthy();
	});

	it("intercepts activation through onLinkClick instead of navigating", () => {
		const onLinkClick = vi.fn();
		const screen = render(
			<ChatMessageText onLinkClick={onLinkClick}>
				https://example.com/protocole
			</ChatMessageText>,
		);
		const link = screen.baseElement.querySelector("a") as HTMLAnchorElement;
		fireEvent.click(link);
		expect(onLinkClick).toHaveBeenCalledWith("https://example.com/protocole");
	});
});

describe("ChatExternalLinkDialog", () => {
	it("stays closed while no URL is pending", () => {
		const screen = render(
			<ChatExternalLinkDialog
				url={null}
				onClose={() => {}}
				title="Vous quittez le site"
				confirmLabel="Ouvrir"
				cancelLabel="Annuler"
			/>,
		);
		expect(screen.queryByText("Vous quittez le site")).toBeNull();
	});

	it("shows the pending URL and opens it in a new tab on confirm", async () => {
		const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
		const onClose = vi.fn();
		const screen = render(
			<ChatExternalLinkDialog
				url="https://example.com/protocole"
				onClose={onClose}
				title="Vous quittez le site"
				description="Do you trust this destination?"
				confirmLabel="Ouvrir"
				cancelLabel="Annuler"
			/>,
		);
		expect(queryBySlot(screen, "chat-external-link-url")?.textContent).toBe(
			"https://example.com/protocole",
		);
		fireEvent.click(screen.getByText("Ouvrir"));
		await vi.waitFor(() => {
			expect(openSpy).toHaveBeenCalledWith(
				"https://example.com/protocole",
				"_blank",
				"noopener,noreferrer",
			);
			expect(onClose).toHaveBeenCalled();
		});
		openSpy.mockRestore();
	});

	it("closes without navigating on cancel", () => {
		const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
		const onClose = vi.fn();
		const screen = render(
			<ChatExternalLinkDialog
				url="https://example.com/protocole"
				onClose={onClose}
				title="Vous quittez le site"
				confirmLabel="Ouvrir"
				cancelLabel="Annuler"
			/>,
		);
		fireEvent.click(screen.getByText("Annuler"));
		expect(onClose).toHaveBeenCalled();
		expect(openSpy).not.toHaveBeenCalled();
		openSpy.mockRestore();
	});
});

describe("ChatMessageTime", () => {
	it("renders a time element keyed to the end-group alignment variant", () => {
		const screen = render(<ChatMessageTime>09:12</ChatMessageTime>);
		const time = queryBySlot(screen, "chat-message-time");
		expect(time?.tagName).toBe("TIME");
		expect(
			time?.classList.contains(
				"group-data-[align=end]:text-primary-foreground",
			),
		).toBe(true);
		// Uses the smallest type token rather than a magic text-[10px].
		expect(time?.classList.contains("text-xs")).toBe(true);
	});

	it("forwards a machine-readable dateTime", () => {
		const screen = render(
			<ChatMessageTime dateTime="2026-06-12T09:12">09:12</ChatMessageTime>,
		);
		const time = queryBySlot(screen, "chat-message-time");
		expect(time?.getAttribute("datetime")).toBe("2026-06-12T09:12");
	});
});

describe("ChatDateSeparator", () => {
	it("renders a separator role with its label", () => {
		const screen = render(<ChatDateSeparator>Hier</ChatDateSeparator>);
		const separator = queryBySlot(screen, "chat-date-separator");
		expect(separator?.getAttribute("role")).toBe("separator");
		expect(separator?.textContent).toBe("Hier");
	});
});

describe("ChatUnreadSeparator", () => {
	it("renders a destructive separator with its label", () => {
		const screen = render(
			<ChatUnreadSeparator>Nouveaux messages</ChatUnreadSeparator>,
		);
		const separator = queryBySlot(screen, "chat-unread-separator");
		expect(separator?.getAttribute("role")).toBe("separator");
		expect(separator?.textContent).toBe("Nouveaux messages");
		expect(separator?.classList.contains("text-destructive")).toBe(true);
	});
});

describe("ChatMessageSender", () => {
	it("renders the name and the optional avatar and badge slots", () => {
		const screen = render(
			<ChatMessageSender
				avatar={<span>AV</span>}
				name="Camille Dubois"
				badge={<span>Pro</span>}
			/>,
		);
		const sender = queryBySlot(screen, "chat-message-sender");
		expect(sender?.textContent).toContain("Camille Dubois");
		expect(sender?.textContent).toContain("AV");
		expect(sender?.textContent).toContain("Pro");
	});
});

describe("ChatComposer", () => {
	function renderComposer(
		props: Partial<ComponentProps<typeof ChatComposer>> = {},
	) {
		const onSubmit = vi.fn();
		const onValueChange = vi.fn();
		const screen = render(
			<ChatComposer
				value="Hello"
				onValueChange={onValueChange}
				onSubmit={onSubmit}
				sendLabel="Envoyer"
				{...props}
			/>,
		);
		const textarea = screen.baseElement.querySelector(
			"[data-slot=textarea]",
		) as HTMLTextAreaElement;
		return { screen, textarea, onSubmit, onValueChange };
	}

	it("submits on Cmd/Ctrl+Enter", () => {
		const { textarea, onSubmit } = renderComposer();
		fireEvent.keyDown(textarea, { key: "Enter", metaKey: true });
		expect(onSubmit).toHaveBeenCalledTimes(1);
	});

	it("does not submit on a plain Enter by default", () => {
		const { textarea, onSubmit } = renderComposer();
		fireEvent.keyDown(textarea, { key: "Enter" });
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("submits on a plain Enter when submitOnEnter is set", () => {
		const { textarea, onSubmit } = renderComposer({ submitOnEnter: true });
		fireEvent.keyDown(textarea, { key: "Enter" });
		expect(onSubmit).toHaveBeenCalledTimes(1);
	});

	it("inserts a newline (does not submit) on Shift+Enter even with submitOnEnter", () => {
		const { textarea, onSubmit } = renderComposer({ submitOnEnter: true });
		fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("never submits the Enter that confirms an IME composition", () => {
		const { textarea, onSubmit } = renderComposer({ submitOnEnter: true });
		fireEvent.keyDown(textarea, { key: "Enter", isComposing: true });
		fireEvent.keyDown(textarea, {
			key: "Enter",
			metaKey: true,
			isComposing: true,
		});
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("suppresses submit while a post is in flight", () => {
		const { textarea, onSubmit, screen } = renderComposer({ sending: true });
		fireEvent.keyDown(textarea, { key: "Enter", metaKey: true });
		expect(onSubmit).not.toHaveBeenCalled();
		// Sending swaps the send icon for a spinner.
		expect(queryBySlot(screen, "spinner")).toBeTruthy();
	});

	it("keeps the textarea enabled (focus preserved) while sending", () => {
		const { textarea } = renderComposer({ sending: true });
		expect(textarea.disabled).toBe(false);
	});

	it("disables the textarea when the composer itself is disabled", () => {
		const { textarea } = renderComposer({ disabled: true });
		expect(textarea.disabled).toBe(true);
	});

	it("does not submit empty (whitespace-only) content", () => {
		const { textarea, onSubmit } = renderComposer({ value: "   " });
		fireEvent.keyDown(textarea, { key: "Enter", metaKey: true });
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("makes the textarea non-resizable", () => {
		const { textarea } = renderComposer();
		expect(textarea.classList.contains("resize-none")).toBe(true);
	});

	it("renders error content as an assertive live region linked to the textarea", () => {
		const { screen, textarea } = renderComposer({
			error: "Message trop long",
		});
		const alert = screen.getByRole("alert");
		expect(alert.textContent).toBe("Message trop long");
		expect(alert.classList.contains("text-destructive")).toBe(true);
		expect(alert.id).not.toBe("");
		expect(textarea.getAttribute("aria-describedby")).toBe(alert.id);
		expect(textarea.getAttribute("aria-invalid")).toBe("true");
	});

	it("renders no alert and no aria error wiring when there is no error", () => {
		const { screen, textarea } = renderComposer();
		expect(screen.queryByRole("alert")).toBeNull();
		expect(textarea.getAttribute("aria-describedby")).toBeNull();
		expect(textarea.getAttribute("aria-invalid")).toBeNull();
	});

	it("renders the hint only when provided", () => {
		const withHint = renderComposer({ hint: "⌘↵ pour envoyer" });
		expect(
			queryBySlot(withHint.screen, "chat-composer-hint")?.textContent,
		).toBe("⌘↵ pour envoyer");
		cleanup();
		const withoutHint = renderComposer();
		expect(queryBySlot(withoutHint.screen, "chat-composer-hint")).toBeNull();
	});

	it("shows a character counter when maxLength is set", () => {
		const { screen } = renderComposer({ value: "Hello", maxLength: 500 });
		const counter = queryBySlot(screen, "chat-composer-counter");
		expect(counter?.textContent).toBe("5/500");
		expect(counter?.classList.contains("text-destructive")).toBe(false);
	});

	it("flags the counter and blocks submit when over maxLength", () => {
		const { screen, textarea, onSubmit } = renderComposer({
			value: "Beaucoup trop long",
			maxLength: 5,
		});
		const counter = queryBySlot(screen, "chat-composer-counter");
		expect(counter?.classList.contains("text-destructive")).toBe(true);
		expect(textarea.getAttribute("aria-invalid")).toBe("true");
		fireEvent.keyDown(textarea, { key: "Enter", metaKey: true });
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("shows no counter without maxLength", () => {
		const { screen } = renderComposer();
		expect(queryBySlot(screen, "chat-composer-counter")).toBeNull();
	});
});

describe("ChatConversationItem", () => {
	it("renders an inert div by default, without interactive affordances", () => {
		const screen = render(<ChatConversationItem title="Support" />);
		const item = queryBySlot(screen, "chat-conversation-item");
		expect(item?.tagName).toBe("DIV");
		// The hover/focus contract only applies once `render` makes the row a
		// real link/button — the inert default must not advertise interactivity.
		expect(item?.classList.contains("focus-visible:ring-3")).toBe(false);
		expect(item?.classList.contains("hover:bg-muted")).toBe(false);
	});

	it("bolds the title and shows the unread count badge when unread", () => {
		const screen = render(
			<ChatConversationItem title="Support" unreadCount={3} />,
		);
		const item = queryBySlot(screen, "chat-conversation-item");
		expect(item?.getAttribute("data-unread")).not.toBeNull();
		const title = screen.getByText("Support");
		expect(title.classList.contains("font-semibold")).toBe(true);
		expect(screen.getByText("3")).toBeTruthy();
	});

	it("caps the unread badge at 99+", () => {
		const screen = render(
			<ChatConversationItem title="Support" unreadCount={128} />,
		);
		expect(screen.getByText("99+")).toBeTruthy();
		expect(screen.queryByText("128")).toBeNull();
	});

	it("exposes the unread badge as a labeled graphic for screen readers", () => {
		const screen = render(
			<ChatConversationItem
				title="Support"
				unreadCount={128}
				unreadLabel="128 unread messages"
			/>,
		);
		// The visible glyph is capped at "99+"; the accessible name carries the
		// true count with context.
		const badge = screen.getByRole("img", { name: "128 unread messages" });
		expect(badge.textContent).toBe("99+");
	});

	it("colors the timestamp as a primary unread cue", () => {
		const unreadScreen = render(
			<ChatConversationItem
				title="Support"
				timestamp="09:10"
				unreadCount={2}
			/>,
		);
		expect(
			unreadScreen.getByText("09:10").classList.contains("text-primary"),
		).toBe(true);
		cleanup();
		const readScreen = render(
			<ChatConversationItem title="Support" timestamp="09:10" />,
		);
		expect(
			readScreen.getByText("09:10").classList.contains("text-muted-foreground"),
		).toBe(true);
	});

	it("shows no badge and a non-bold title when fully read", () => {
		const screen = render(<ChatConversationItem title="Support" />);
		const title = screen.getByText("Support");
		expect(title.classList.contains("font-medium")).toBe(true);
		expect(title.classList.contains("font-semibold")).toBe(false);
	});

	it("renders the description and timestamp slots", () => {
		const screen = render(
			<ChatConversationItem
				title="Support"
				description="Our team replies to you here."
				timestamp="09:10"
			/>,
		);
		const item = queryBySlot(screen, "chat-conversation-item");
		expect(item?.textContent).toContain("Our team replies to you here.");
		expect(item?.textContent).toContain("09:10");
	});

	it("renders the leading slot before the text column", () => {
		const screen = render(
			<ChatConversationItem
				title="Support"
				leading={<span data-testid="avatar">SU</span>}
			/>,
		);
		const item = queryBySlot(screen, "chat-conversation-item");
		expect(item?.firstElementChild?.getAttribute("data-testid")).toBe("avatar");
	});

	it("becomes a real link with interactive affordances via the render prop", () => {
		const screen = render(
			<ChatConversationItem
				title="Support"
				render={<a href="/conversations/1">Support</a>}
			/>,
		);
		const item = queryBySlot(screen, "chat-conversation-item");
		expect(item?.tagName).toBe("A");
		expect(item?.getAttribute("href")).toBe("/conversations/1");
		expect(item?.classList.contains("focus-visible:ring-3")).toBe(true);
		expect(item?.classList.contains("hover:bg-muted")).toBe(true);
	});

	it("merges a consumer className over the base classes", () => {
		const screen = render(
			<ChatConversationItem title="Support" className="custom-item" />,
		);
		const item = queryBySlot(screen, "chat-conversation-item");
		expect(item?.classList.contains("custom-item")).toBe(true);
		expect(item?.classList.contains("rounded-lg")).toBe(true);
	});
});
