// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Chat, useChatScrollerScrollable } from "#/chat/index.ts";

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

describe("Chat scroller", () => {
	function renderScroller(children: React.ReactNode) {
		return render(
			<Chat.Provider autoScroll>
				<Chat.Root>
					<Chat.Viewport aria-label="Conversation">
						<Chat.Transcript>{children}</Chat.Transcript>
					</Chat.Viewport>
					<Chat.ScrollButton label="Nouveaux messages" />
				</Chat.Root>
			</Chat.Provider>,
		);
	}

	it("renders the frame, viewport, transcript and rows", () => {
		const screen = renderScroller(
			<Chat.Item messageId="m1">
				<p>Bonjour</p>
			</Chat.Item>,
		);
		expect(queryBySlot(screen, "chat-root")).toBeTruthy();
		expect(queryBySlot(screen, "chat-viewport")).toBeTruthy();
		expect(queryBySlot(screen, "chat-transcript")).toBeTruthy();
		expect(queryBySlot(screen, "chat-item")).toBeTruthy();
		expect(screen.getByText("Bonjour")).toBeTruthy();
	});

	it("exposes the viewport as a focusable labeled region", () => {
		const screen = renderScroller(null);
		const viewport = queryBySlot(screen, "chat-viewport");
		expect(viewport?.getAttribute("role")).toBe("region");
		expect(viewport?.getAttribute("aria-label")).toBe("Conversation");
		expect(viewport?.getAttribute("tabindex")).toBe("0");
	});

	it("announces new rows politely to screen readers", () => {
		const screen = renderScroller(null);
		const transcript = queryBySlot(screen, "chat-transcript");
		expect(transcript?.getAttribute("role")).toBe("log");
		expect(transcript?.getAttribute("aria-live")).toBe("polite");
		expect(transcript?.getAttribute("aria-relevant")).toBe("additions");
	});

	it("fades the bottom edge and themes the scrollbar for dark mode", () => {
		const screen = renderScroller(null);
		const viewport = queryBySlot(screen, "chat-viewport");
		expect(viewport?.classList.contains("scroll-fade-b")).toBe(true);
		expect(viewport?.classList.contains("dark:scheme-dark")).toBe(true);
	});

	it("tags rows with their message id and anchor flag", () => {
		const screen = renderScroller(
			<Chat.Item messageId="m1" scrollAnchor>
				x
			</Chat.Item>,
		);
		const item = queryBySlot(screen, "chat-item");
		expect(item?.getAttribute("data-message-id")).toBe("m1");
		expect(item?.getAttribute("data-scroll-anchor")).toBe("true");
	});

	it("renders the transcript tail spacer hidden by default", () => {
		const screen = renderScroller(<Chat.Item messageId="m1">x</Chat.Item>);
		const spacer = screen.baseElement.querySelector(
			"[data-message-scroller-spacer]",
		) as HTMLElement;
		expect(spacer).toBeTruthy();
		expect(spacer.hidden).toBe(true);
	});

	it("keeps the scroll button inert and unfocusable while there is no overflow", () => {
		const screen = renderScroller(<Chat.Item messageId="m1">x</Chat.Item>);
		const button = queryBySlot(screen, "chat-scroll-button");
		// jsdom reports zero scroll metrics: nothing to scroll toward, so the
		// affordance stays inactive.
		expect(button?.getAttribute("data-active")).toBe("false");
		expect(button?.getAttribute("tabindex")).toBe("-1");
		expect(button?.textContent).toContain("Nouveaux messages");
	});

	it("exposes the follow state through useChatScrollerScrollable", () => {
		const seen: boolean[] = [];
		function Probe() {
			const scrollable = useChatScrollerScrollable();
			seen.push(scrollable.end);
			return null;
		}
		render(
			<Chat.Provider autoScroll>
				<Probe />
				<Chat.Root>
					<Chat.Viewport>
						<Chat.Transcript>
							<Chat.Item messageId="m1">x</Chat.Item>
						</Chat.Transcript>
					</Chat.Viewport>
				</Chat.Root>
			</Chat.Provider>,
		);
		// Everything fits: no overflow toward the end (the reader is following).
		expect(seen.at(-1)).toBe(false);
	});
});

describe("Chat.Message", () => {
	it("exposes the alignment and mirrors the end row", () => {
		const screen = render(
			<Chat.Message align="end">
				<Chat.Content>x</Chat.Content>
			</Chat.Message>,
		);
		const message = queryBySlot(screen, "chat-message");
		expect(message?.getAttribute("data-align")).toBe("end");
		expect(
			message?.classList.contains("data-[align=end]:flex-row-reverse"),
		).toBe(true);
		// `group/message` lets descendants react to the row's alignment.
		expect(message?.classList.contains("group/message")).toBe(true);
	});

	it("defaults to start alignment", () => {
		const screen = render(<Chat.Message>x</Chat.Message>);
		expect(
			queryBySlot(screen, "chat-message")?.getAttribute("data-align"),
		).toBe("start");
	});

	it("renders avatar, header, content and footer slots", () => {
		const screen = render(
			<Chat.Message>
				<Chat.Avatar>AV</Chat.Avatar>
				<Chat.Content>
					<Chat.Header>Camille Dubois</Chat.Header>
					<Chat.Bubble variant="muted">
						<Chat.BubbleContent>Bonjour</Chat.BubbleContent>
					</Chat.Bubble>
					<Chat.Footer>Distribué</Chat.Footer>
				</Chat.Content>
			</Chat.Message>,
		);
		expect(queryBySlot(screen, "chat-avatar")?.textContent).toBe("AV");
		expect(queryBySlot(screen, "chat-header")?.textContent).toBe(
			"Camille Dubois",
		);
		expect(queryBySlot(screen, "chat-footer")?.textContent).toBe("Distribué");
		expect(screen.getByText("Bonjour")).toBeTruthy();
	});

	it("wraps unbroken words/URLs instead of overflowing the row", () => {
		const screen = render(
			<Chat.Message>
				<Chat.Content>
					https://example.com/une-url-tres-longue-sans-espace
				</Chat.Content>
			</Chat.Message>,
		);
		const content = queryBySlot(screen, "chat-content");
		expect(content?.classList.contains("min-w-0")).toBe(true);
		expect(content?.classList.contains("[overflow-wrap:anywhere]")).toBe(true);
	});
});

describe("Chat.Bubble", () => {
	it("exposes the variant and alignment as data attributes", () => {
		const screen = render(
			<Chat.Bubble variant="default" align="end">
				<Chat.BubbleContent>Salut</Chat.BubbleContent>
			</Chat.Bubble>,
		);
		const bubble = queryBySlot(screen, "chat-bubble");
		expect(bubble?.getAttribute("data-variant")).toBe("default");
		expect(bubble?.getAttribute("data-align")).toBe("end");
	});

	it.each([
		"default",
		"secondary",
		"muted",
		"tinted",
		"outline",
		"ghost",
		"destructive",
	] as const)("renders the %s variant", (variant) => {
		const screen = render(
			<Chat.Bubble variant={variant}>
				<Chat.BubbleContent>x</Chat.BubbleContent>
			</Chat.Bubble>,
		);
		expect(
			queryBySlot(screen, "chat-bubble")?.getAttribute("data-variant"),
		).toBe(variant);
	});

	it("keeps long content inside the bubble surface", () => {
		const screen = render(
			<Chat.Bubble variant="muted">
				<Chat.BubbleContent>
					https://example.com/une-url-tres-longue-sans-espace
				</Chat.BubbleContent>
			</Chat.Bubble>,
		);
		const content = queryBySlot(screen, "chat-bubble-content");
		expect(content?.classList.contains("min-w-0")).toBe(true);
		expect(content?.classList.contains("[overflow-wrap:anywhere]")).toBe(true);
	});

	it("animates in but respects reduced motion", () => {
		const screen = render(
			<Chat.Bubble variant="default">
				<Chat.BubbleContent>x</Chat.BubbleContent>
			</Chat.Bubble>,
		);
		const content = queryBySlot(screen, "chat-bubble-content");
		expect(content?.classList.contains("animate-in")).toBe(true);
		expect(content?.classList.contains("motion-reduce:animate-none")).toBe(
			true,
		);
	});

	it("renders an interactive surface through the render prop", () => {
		const onClick = vi.fn();
		const screen = render(
			<Chat.Bubble variant="muted">
				<Chat.BubbleContent render={<button type="button" onClick={onClick} />}>
					Ouvrir
				</Chat.BubbleContent>
			</Chat.Bubble>,
		);
		const content = queryBySlot(screen, "chat-bubble-content");
		expect(content?.tagName).toBe("BUTTON");
		fireEvent.click(content as HTMLElement);
		expect(onClick).toHaveBeenCalled();
	});

	it("groups consecutive bubbles", () => {
		const screen = render(
			<Chat.BubbleGroup>
				<Chat.Bubble variant="muted">
					<Chat.BubbleContent>a</Chat.BubbleContent>
				</Chat.Bubble>
				<Chat.Bubble variant="muted">
					<Chat.BubbleContent>b</Chat.BubbleContent>
				</Chat.Bubble>
			</Chat.BubbleGroup>,
		);
		const group = queryBySlot(screen, "chat-bubble-group");
		expect(group?.querySelectorAll("[data-slot=chat-bubble]")).toHaveLength(2);
	});

	it("positions reactions on the requested side and alignment", () => {
		const screen = render(
			<Chat.Bubble variant="muted">
				<Chat.BubbleContent>Salut</Chat.BubbleContent>
				<Chat.Reactions side="top" align="start">
					<span>👍</span>
				</Chat.Reactions>
			</Chat.Bubble>,
		);
		const reactions = queryBySlot(screen, "chat-reactions");
		expect(reactions?.getAttribute("data-side")).toBe("top");
		expect(reactions?.getAttribute("data-align")).toBe("start");
		expect(reactions?.textContent).toBe("👍");
	});
});

describe("Chat.Marker", () => {
	it("renders an inline marker with icon and content", () => {
		const screen = render(
			<Chat.Marker>
				<Chat.MarkerIcon>
					<svg role="presentation" />
				</Chat.MarkerIcon>
				<Chat.MarkerContent>4 fichiers explorés</Chat.MarkerContent>
			</Chat.Marker>,
		);
		const marker = queryBySlot(screen, "chat-marker");
		expect(marker?.getAttribute("data-variant")).toBe("default");
		expect(
			queryBySlot(screen, "chat-marker-icon")?.getAttribute("aria-hidden"),
		).toBe("true");
		expect(queryBySlot(screen, "chat-marker-content")?.textContent).toBe(
			"4 fichiers explorés",
		);
	});

	it.each([
		"default",
		"separator",
		"border",
	] as const)("exposes the %s variant as a data attribute", (variant) => {
		const screen = render(
			<Chat.Marker variant={variant}>
				<Chat.MarkerContent>x</Chat.MarkerContent>
			</Chat.Marker>,
		);
		expect(
			queryBySlot(screen, "chat-marker")?.getAttribute("data-variant"),
		).toBe(variant);
	});

	it("becomes a real link through the render prop", () => {
		const screen = render(
			<Chat.Marker
				render={
					// biome-ignore lint/a11y/useAnchorContent: content is merged in from Chat.Marker
					<a href="/details" />
				}
			>
				<Chat.MarkerContent>Voir le détail</Chat.MarkerContent>
			</Chat.Marker>,
		);
		const marker = queryBySlot(screen, "chat-marker");
		expect(marker?.tagName).toBe("A");
		expect(marker?.getAttribute("href")).toBe("/details");
	});
});

describe("Chat.DateSeparator", () => {
	it("renders a separator role with its label between rules", () => {
		const screen = render(<Chat.DateSeparator>Hier</Chat.DateSeparator>);
		const separator = queryBySlot(screen, "chat-date-separator");
		expect(separator?.getAttribute("role")).toBe("separator");
		expect(separator?.textContent).toBe("Hier");
		expect(separator?.classList.contains("before:flex-1")).toBe(true);
	});
});

describe("Chat.UnreadSeparator", () => {
	it("renders a destructive separator with its label", () => {
		const screen = render(
			<Chat.UnreadSeparator>Nouveaux messages</Chat.UnreadSeparator>,
		);
		const separator = queryBySlot(screen, "chat-unread-separator");
		expect(separator?.getAttribute("role")).toBe("separator");
		expect(separator?.textContent).toBe("Nouveaux messages");
		expect(separator?.classList.contains("text-destructive")).toBe(true);
	});
});

describe("Chat.Text", () => {
	it("turns URLs into links opening in a new tab and keeps surrounding text", () => {
		const screen = render(
			<Chat.Text>
				Voici le lien : https://example.com/protocole pour samedi.
			</Chat.Text>,
		);
		const link = screen.baseElement.querySelector("a");
		expect(link?.getAttribute("href")).toBe("https://example.com/protocole");
		expect(link?.getAttribute("target")).toBe("_blank");
		expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
		expect(queryBySlot(screen, "chat-text")?.textContent).toContain(
			"pour samedi.",
		);
	});

	it("leaves trailing sentence punctuation out of the URL", () => {
		const screen = render(
			<Chat.Text>Regarde https://example.com/page.</Chat.Text>,
		);
		const link = screen.baseElement.querySelector("a");
		expect(link?.getAttribute("href")).toBe("https://example.com/page");
	});

	it("renders plain text untouched when there is no URL", () => {
		const screen = render(<Chat.Text>Bonjour à tous</Chat.Text>);
		expect(screen.baseElement.querySelector("a")).toBeNull();
		expect(screen.getByText("Bonjour à tous")).toBeTruthy();
	});

	it("intercepts activation through onLinkClick instead of navigating", () => {
		const onLinkClick = vi.fn();
		const screen = render(
			<Chat.Text onLinkClick={onLinkClick}>
				https://example.com/protocole
			</Chat.Text>,
		);
		const link = screen.baseElement.querySelector("a") as HTMLAnchorElement;
		fireEvent.click(link);
		expect(onLinkClick).toHaveBeenCalledWith("https://example.com/protocole");
	});
});

describe("Chat.ExternalLinkDialog", () => {
	it("stays closed while no URL is pending", () => {
		const screen = render(
			<Chat.ExternalLinkDialog
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
			<Chat.ExternalLinkDialog
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
			<Chat.ExternalLinkDialog
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

describe("Chat.Time", () => {
	it("renders a subdued time element inheriting the bubble color", () => {
		const screen = render(<Chat.Time>09:12</Chat.Time>);
		const time = queryBySlot(screen, "chat-time");
		expect(time?.tagName).toBe("TIME");
		// Uses the smallest type token and opacity so it works on any bubble
		// variant (primary, muted, destructive…) without per-variant colors.
		expect(time?.classList.contains("text-xs")).toBe(true);
		expect(time?.classList.contains("opacity-70")).toBe(true);
	});

	it("forwards a machine-readable dateTime", () => {
		const screen = render(
			<Chat.Time dateTime="2026-06-12T09:12">09:12</Chat.Time>,
		);
		const time = queryBySlot(screen, "chat-time");
		expect(time?.getAttribute("datetime")).toBe("2026-06-12T09:12");
	});
});

describe("Chat.Composer", () => {
	function renderComposer(
		props: Partial<ComponentProps<typeof Chat.Composer>> = {},
	) {
		const onSubmit = vi.fn();
		const onValueChange = vi.fn();
		const screen = render(
			<Chat.Composer
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

describe("Chat.ConversationItem", () => {
	it("renders an inert div by default, without interactive affordances", () => {
		const screen = render(<Chat.ConversationItem title="Support" />);
		const item = queryBySlot(screen, "chat-conversation-item");
		expect(item?.tagName).toBe("DIV");
		// The hover/focus contract only applies once `render` makes the row a
		// real link/button — the inert default must not advertise interactivity.
		expect(item?.classList.contains("focus-visible:ring-3")).toBe(false);
		expect(item?.classList.contains("hover:bg-muted")).toBe(false);
	});

	it("bolds the title and shows the unread count badge when unread", () => {
		const screen = render(
			<Chat.ConversationItem title="Support" unreadCount={3} />,
		);
		const item = queryBySlot(screen, "chat-conversation-item");
		expect(item?.getAttribute("data-unread")).not.toBeNull();
		const title = screen.getByText("Support");
		expect(title.classList.contains("font-semibold")).toBe(true);
		expect(screen.getByText("3")).toBeTruthy();
	});

	it("caps the unread badge at 99+", () => {
		const screen = render(
			<Chat.ConversationItem title="Support" unreadCount={128} />,
		);
		expect(screen.getByText("99+")).toBeTruthy();
		expect(screen.queryByText("128")).toBeNull();
	});

	it("exposes the unread badge as a labeled graphic for screen readers", () => {
		const screen = render(
			<Chat.ConversationItem
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
			<Chat.ConversationItem
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
			<Chat.ConversationItem title="Support" timestamp="09:10" />,
		);
		expect(
			readScreen.getByText("09:10").classList.contains("text-muted-foreground"),
		).toBe(true);
	});

	it("shows no badge and a non-bold title when fully read", () => {
		const screen = render(<Chat.ConversationItem title="Support" />);
		const title = screen.getByText("Support");
		expect(title.classList.contains("font-medium")).toBe(true);
		expect(title.classList.contains("font-semibold")).toBe(false);
	});

	it("renders the description and timestamp slots", () => {
		const screen = render(
			<Chat.ConversationItem
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
			<Chat.ConversationItem
				title="Support"
				leading={<span data-testid="avatar">SU</span>}
			/>,
		);
		const item = queryBySlot(screen, "chat-conversation-item");
		expect(item?.firstElementChild?.getAttribute("data-testid")).toBe("avatar");
	});

	it("becomes a real link with interactive affordances via the render prop", () => {
		const screen = render(
			<Chat.ConversationItem
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
			<Chat.ConversationItem title="Support" className="custom-item" />,
		);
		const item = queryBySlot(screen, "chat-conversation-item");
		expect(item?.classList.contains("custom-item")).toBe(true);
		expect(item?.classList.contains("rounded-lg")).toBe(true);
	});
});

describe("Chat.MessageList", () => {
	it("renders the header and children inside the scroll slot", () => {
		const screen = render(
			<Chat.MessageList header={<button type="button">Load older</button>}>
				<p>Bonjour</p>
			</Chat.MessageList>,
		);
		const list = queryBySlot(screen, "chat-message-list");
		expect(list?.tagName).toBe("DIV");
		expect(screen.getByText("Load older")).toBeTruthy();
		expect(screen.getByText("Bonjour")).toBeTruthy();
	});

	it("announces new messages politely to screen readers", () => {
		const screen = render(<Chat.MessageList>x</Chat.MessageList>);
		const list = queryBySlot(screen, "chat-message-list");
		expect(list?.getAttribute("role")).toBe("log");
		expect(list?.getAttribute("aria-live")).toBe("polite");
	});

	it("scrolls to the bottom on first mount", () => {
		const screen = render(
			<Chat.MessageList>
				<p>Latest</p>
			</Chat.MessageList>,
		);
		const list = queryBySlot(screen, "chat-message-list") as HTMLDivElement;
		// jsdom reports 0 for layout metrics; the effect still assigns scrollTop
		// from scrollHeight, so the two end up equal (the "land at bottom" intent).
		expect(list.scrollTop).toBe(list.scrollHeight);
	});

	it("notifies onFollowChange when the reader scrolls away from the bottom", () => {
		const onFollowChange = vi.fn();
		const screen = render(
			<Chat.MessageList onFollowChange={onFollowChange}>
				<p>History</p>
			</Chat.MessageList>,
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
			<Chat.MessageList onFollowChange={onFollowChange} followThreshold={500}>
				<p>History</p>
			</Chat.MessageList>,
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
			<Chat.MessageList>{[<p key="a">Premier</p>]}</Chat.MessageList>,
		);
		const list = queryBySlot(screen, "chat-message-list") as HTMLDivElement;
		defineScrollMetrics(list, { scrollHeight: 1000, clientHeight: 200 });
		// Reading history: far from the bottom.
		list.scrollTop = 100;
		fireEvent.scroll(list);
		screen.rerender(
			<Chat.MessageList>
				{[<p key="a">Premier</p>, <p key="b">Nouveau</p>]}
			</Chat.MessageList>,
		);
		expect(list.scrollTop).toBe(100);
	});

	it("preserves the viewport on prepend when native scroll anchoring is missing", () => {
		const screen = render(
			<Chat.MessageList>{[<p key="a">Anchored</p>]}</Chat.MessageList>,
		);
		const list = queryBySlot(screen, "chat-message-list") as HTMLDivElement;
		defineScrollMetrics(list, { scrollHeight: 1000, clientHeight: 200 });
		// Re-run the effect so it records the 1000px height as the baseline.
		screen.rerender(
			<Chat.MessageList>{[<p key="a">Anchored</p>]}</Chat.MessageList>,
		);
		list.scrollTop = 100;
		fireEvent.scroll(list);
		// Loading older history grows the content above the anchored message.
		defineScrollMetrics(list, { scrollHeight: 1400, clientHeight: 200 });
		screen.rerender(
			<Chat.MessageList>
				{[<p key="older">Older</p>, <p key="a">Anchored</p>]}
			</Chat.MessageList>,
		);
		// jsdom (like Safari) lacks overflow-anchor: the list compensates by the
		// 400px height delta so the reader stays on the same message.
		expect(list.scrollTop).toBe(500);
	});

	it("shows a jump-to-latest button while away from the bottom and jumps on click", () => {
		const screen = render(
			<Chat.MessageList jumpToLatestLabel="Nouveaux messages">
				<p>History</p>
			</Chat.MessageList>,
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
		const screen = render(<Chat.MessageList>x</Chat.MessageList>);
		const list = queryBySlot(screen, "chat-message-list") as HTMLDivElement;
		defineScrollMetrics(list, { scrollHeight: 1000, clientHeight: 200 });
		list.scrollTop = 0;
		fireEvent.scroll(list);
		expect(queryBySlot(screen, "chat-jump-to-latest")).toBeNull();
	});

	it("opts into a dark color-scheme so the native scrollbar matches the theme", () => {
		const screen = render(<Chat.MessageList>x</Chat.MessageList>);
		const list = queryBySlot(screen, "chat-message-list");
		expect(list?.classList.contains("dark:scheme-dark")).toBe(true);
	});
});

describe("Chat.MessageGroup", () => {
	it("exposes the alignment as data-align and carries the group marker", () => {
		const screen = render(<Chat.MessageGroup align="end">x</Chat.MessageGroup>);
		const group = queryBySlot(screen, "chat-message-group");
		expect(group?.getAttribute("data-align")).toBe("end");
		// `group` is what lets group-data-[align=end]:* on Chat.MessageTime match.
		expect(group?.classList.contains("group")).toBe(true);
		expect(group?.classList.contains("items-end")).toBe(true);
	});

	it("left-aligns a start group", () => {
		const screen = render(
			<Chat.MessageGroup align="start">x</Chat.MessageGroup>,
		);
		expect(
			queryBySlot(screen, "chat-message-group")?.classList.contains(
				"items-start",
			),
		).toBe(true);
	});
});

describe("Chat.MessageBubble", () => {
	it("exposes the variant as a data attribute with its bubble classes", () => {
		const screen = render(
			<Chat.MessageBubble variant="own">Salut</Chat.MessageBubble>,
		);
		const message = queryBySlot(screen, "chat-message-bubble");
		expect(message?.getAttribute("data-variant")).toBe("own");
		expect(message?.classList.contains("bg-primary")).toBe(true);
	});

	it("renders the other variant with the muted bubble", () => {
		const screen = render(
			<Chat.MessageBubble variant="other">Bonjour</Chat.MessageBubble>,
		);
		const message = queryBySlot(screen, "chat-message-bubble");
		expect(message?.getAttribute("data-variant")).toBe("other");
		expect(message?.classList.contains("bg-muted")).toBe(true);
	});

	it("wraps unbroken words/URLs instead of overflowing the bubble", () => {
		const screen = render(
			<Chat.MessageBubble variant="other">
				https://example.com/une-url-tres-longue-sans-espace
			</Chat.MessageBubble>,
		);
		const message = queryBySlot(screen, "chat-message-bubble");
		expect(message?.classList.contains("min-w-0")).toBe(true);
		expect(message?.classList.contains("[overflow-wrap:anywhere]")).toBe(true);
	});

	it("animates in but respects reduced motion", () => {
		const screen = render(
			<Chat.MessageBubble variant="own">x</Chat.MessageBubble>,
		);
		const message = queryBySlot(screen, "chat-message-bubble");
		expect(message?.classList.contains("animate-in")).toBe(true);
		expect(message?.classList.contains("motion-reduce:animate-none")).toBe(
			true,
		);
	});
});

describe("Chat.MessageText", () => {
	it("turns URLs into links opening in a new tab and keeps surrounding text", () => {
		const screen = render(
			<Chat.MessageText>
				Voici le lien : https://example.com/protocole pour samedi.
			</Chat.MessageText>,
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
			<Chat.MessageText>Regarde https://example.com/page.</Chat.MessageText>,
		);
		const link = screen.baseElement.querySelector("a");
		expect(link?.getAttribute("href")).toBe("https://example.com/page");
	});

	it("renders plain text untouched when there is no URL", () => {
		const screen = render(<Chat.MessageText>Hello everyone</Chat.MessageText>);
		expect(screen.baseElement.querySelector("a")).toBeNull();
		expect(screen.getByText("Hello everyone")).toBeTruthy();
	});

	it("intercepts activation through onLinkClick instead of navigating", () => {
		const onLinkClick = vi.fn();
		const screen = render(
			<Chat.MessageText onLinkClick={onLinkClick}>
				https://example.com/protocole
			</Chat.MessageText>,
		);
		const link = screen.baseElement.querySelector("a") as HTMLAnchorElement;
		fireEvent.click(link);
		expect(onLinkClick).toHaveBeenCalledWith("https://example.com/protocole");
	});
});

describe("Chat.MessageTime", () => {
	it("renders a time element keyed to the end-group alignment variant", () => {
		const screen = render(<Chat.MessageTime>09:12</Chat.MessageTime>);
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
			<Chat.MessageTime dateTime="2026-06-12T09:12">09:12</Chat.MessageTime>,
		);
		const time = queryBySlot(screen, "chat-message-time");
		expect(time?.getAttribute("datetime")).toBe("2026-06-12T09:12");
	});
});

describe("Chat.MessageSender", () => {
	it("renders the name and the optional avatar and badge slots", () => {
		const screen = render(
			<Chat.MessageSender
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
