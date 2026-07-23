import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Avatar, AvatarFallback } from "@voila.dev/ui/components/avatar";
import { Badge } from "@voila.dev/ui/components/badge";
import { Button } from "@voila.dev/ui/components/button";
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
} from "@voila.dev/ui/components/chat";
import { useState } from "react";

const meta = {
	title: "UI/Chat",
	component: ChatMessageList,
	tags: ["autodocs"],
} satisfies Meta<typeof ChatMessageList>;

export default meta;

type Story = StoryObj<typeof meta>;

function senderAvatar(initials: string) {
	return (
		<Avatar size="sm">
			<AvatarFallback>{initials}</AvatarFallback>
		</Avatar>
	);
}

type LiveMessage = {
	readonly id: number;
	readonly author: "own" | "other";
	readonly text: string;
};

function liveMessageTime(id: number): string {
	return `09:${String(10 + (id % 50)).padStart(2, "0")}`;
}

// Consecutive messages from the same author render as one bubble group,
// in the order they were sent/received.
function groupConsecutiveMessages(
	messages: ReadonlyArray<LiveMessage>,
): LiveMessage[][] {
	const groups: LiveMessage[][] = [];
	let previousAuthor: LiveMessage["author"] | undefined;
	for (const message of messages) {
		if (message.author === previousAuthor) {
			groups[groups.length - 1]?.push(message);
		} else {
			groups.push([message]);
		}
		previousAuthor = message.author;
	}
	return groups;
}

function FullFeaturedPlayground() {
	const [historyLoaded, setHistoryLoaded] = useState(false);
	const [draft, setDraft] = useState("");
	const [sending, setSending] = useState(false);
	const [liveMessages, setLiveMessages] = useState<ReadonlyArray<LiveMessage>>(
		[],
	);
	const [following, setFollowing] = useState(true);
	const [pendingUrl, setPendingUrl] = useState<string | null>(null);

	const submitDraft = () => {
		const message = draft.trim();
		setDraft("");
		setSending(true);
		window.setTimeout(() => {
			setLiveMessages((previous) => [
				...previous,
				{ id: previous.length, author: "own", text: message },
			]);
			setSending(false);
		}, 600);
	};

	const liveGroups = groupConsecutiveMessages(liveMessages);

	return (
		<div className="flex w-full max-w-4xl flex-col gap-3">
			<div className="flex h-[28rem] gap-4">
				<aside className="hidden w-64 shrink-0 flex-col gap-1 border-r pr-4 sm:flex">
					<ChatConversationItem
						leading={senderAvatar("RC")}
						title="Match RC Toulon — 13 juin"
						badges={<Badge variant="outline">Événement</Badge>}
						description="Camille : Petit changement…"
						timestamp="08:55"
						unreadCount={2}
						className="bg-muted"
						render={<button type="button" />}
					/>
					<ChatConversationItem
						leading={senderAvatar("SU")}
						title="Support"
						badges={<Badge variant="secondary">Support</Badge>}
						description="Notre équipe vous répond directement ici."
						timestamp="Hier"
						render={<button type="button" />}
					/>
					<ChatConversationItem
						leading={senderAvatar("T6")}
						title="Tournoi des 6 stations"
						badges={
							<>
								<Badge variant="outline">Événement</Badge>
								<Badge variant="secondary">Archivée</Badge>
							</>
						}
						description="Conversation archivée"
						timestamp="12/04"
						render={<button type="button" />}
					/>
				</aside>
				<div className="flex min-w-0 flex-1 flex-col gap-3">
					<ChatMessageList
						jumpToLatestLabel="Nouveaux messages"
						onFollowChange={setFollowing}
						header={
							historyLoaded ? null : (
								<div className="flex justify-center">
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => setHistoryLoaded(true)}
									>
										Charger les messages précédents
									</Button>
								</div>
							)
						}
					>
						{historyLoaded ? (
							<>
								<ChatDateSeparator>Lundi</ChatDateSeparator>
								<ChatMessageGroup align="start">
									<ChatMessageSender
										avatar={senderAvatar("NG")}
										name="Nathan Guyot"
										badge={<Badge variant="organization">RC Toulon</Badge>}
									/>
									<ChatMessage variant="other">
										Bienvenue dans la conversation du match !
										<ChatMessageTime dateTime="2026-06-08T10:15">
											10:15
										</ChatMessageTime>
									</ChatMessage>
								</ChatMessageGroup>
								<ChatMessageGroup align="end">
									<ChatMessage variant="own">
										Merci, ravi d'être de la partie.
										<ChatMessageTime dateTime="2026-06-08T10:20">
											10:20
										</ChatMessageTime>
									</ChatMessage>
								</ChatMessageGroup>
							</>
						) : null}
						<ChatDateSeparator>Hier</ChatDateSeparator>
						<ChatMessageGroup align="start">
							<ChatMessageSender
								avatar={senderAvatar("CD")}
								name="Camille Dubois"
								badge={<Badge variant="provider">Professionnel de santé</Badge>}
							/>
							<ChatMessage variant="other">
								Bonjour, je serai sur place 30 minutes avant le match.
								<ChatMessageTime dateTime="2026-06-11T18:42">
									18:42
								</ChatMessageTime>
							</ChatMessage>
							<ChatMessage variant="other">
								Y a-t-il un local pour déposer mon matériel ?
								<ChatMessageTime dateTime="2026-06-11T18:43">
									18:43
								</ChatMessageTime>
							</ChatMessage>
						</ChatMessageGroup>
						<ChatMessageGroup align="start">
							<ChatMessageSender
								avatar={senderAvatar("NG")}
								name="Nathan Guyot"
								badge={<Badge variant="organization">RC Toulon</Badge>}
							/>
							<ChatMessage variant="other">
								Oui, le vestiaire arbitres est réservé pour vous.
								<ChatMessageTime dateTime="2026-06-11T19:05">
									19:05
								</ChatMessageTime>
							</ChatMessage>
						</ChatMessageGroup>
						<ChatMessageGroup align="end">
							<ChatMessage variant="own">
								Parfait, merci ! À samedi.
								<ChatMessageTime dateTime="2026-06-11T19:10">
									19:10
								</ChatMessageTime>
							</ChatMessage>
						</ChatMessageGroup>
						<ChatUnreadSeparator>Nouveaux messages</ChatUnreadSeparator>
						<ChatDateSeparator>Aujourd'hui</ChatDateSeparator>
						<ChatMessageGroup align="start">
							<ChatMessageSender
								avatar={senderAvatar("CD")}
								name="Camille Dubois"
								badge={<Badge variant="provider">Professionnel de santé</Badge>}
							/>
							<ChatMessage variant="other">
								Petit changement : j'arriverai finalement à 13h30.
								<ChatMessageTime dateTime="2026-06-12T08:55">
									08:55
								</ChatMessageTime>
							</ChatMessage>
						</ChatMessageGroup>
						{liveGroups.map((group) => {
							const [firstMessage] = group;
							if (firstMessage === undefined) {
								return null;
							}
							if (firstMessage.author === "own") {
								return (
									<ChatMessageGroup key={firstMessage.id} align="end">
										{group.map((message) => (
											<ChatMessage key={message.id} variant="own">
												<ChatMessageText onLinkClick={setPendingUrl}>
													{message.text}
												</ChatMessageText>
												<ChatMessageTime>
													{liveMessageTime(message.id)}
												</ChatMessageTime>
											</ChatMessage>
										))}
									</ChatMessageGroup>
								);
							}
							return (
								<ChatMessageGroup key={firstMessage.id} align="start">
									<ChatMessageSender
										avatar={senderAvatar("NG")}
										name="Nathan Guyot"
										badge={<Badge variant="organization">RC Toulon</Badge>}
									/>
									{group.map((message) => (
										<ChatMessage key={message.id} variant="other">
											<ChatMessageText onLinkClick={setPendingUrl}>
												{message.text}
											</ChatMessageText>
											<ChatMessageTime>
												{liveMessageTime(message.id)}
											</ChatMessageTime>
										</ChatMessage>
									))}
								</ChatMessageGroup>
							);
						})}
					</ChatMessageList>
					<ChatComposer
						value={draft}
						onValueChange={setDraft}
						onSubmit={submitDraft}
						placeholder="Écrire un message…"
						sendLabel="Envoyer"
						hint="⌘↵ pour envoyer"
						maxLength={500}
						sending={sending}
					/>
				</div>
			</div>
			<div className="flex items-center justify-between gap-2 border-t pt-3">
				<span className="text-muted-foreground text-xs">
					{following
						? "Vous suivez la conversation."
						: "Vous lisez l'historique — un nouveau message affiche le bouton flottant."}
				</span>
				<Button
					type="button"
					size="sm"
					variant="outline"
					onClick={() =>
						setLiveMessages((previous) => [
							...previous,
							{
								id: previous.length,
								author: "other",
								text: `Réponse simulée #${
									previous.filter((message) => message.author === "other")
										.length + 1
								}`,
							},
						])
					}
				>
					Simuler une réponse
				</Button>
			</div>
			<ChatExternalLinkDialog
				url={pendingUrl}
				onClose={() => setPendingUrl(null)}
				title="Vous quittez acme.dev"
				description="Ce lien mène vers un site externe. Ouvrez-le uniquement si vous faites confiance à cette destination."
				confirmLabel="Ouvrir le lien"
				cancelLabel="Annuler"
			/>
		</div>
	);
}

/** Everything wired together: conversation list, thread with date and unread
 * separators, load-older prepend, jump-to-latest while reading history,
 * simulated incoming replies, and a live composer (counter, hint, sending
 * spinner). Send a message or scroll up and simulate a reply to exercise the
 * whole kit. */
export const FullFeatured: Story = {
	render: () => <FullFeaturedPlayground />,
};

export const Thread: Story = {
	render: () => (
		<div className="flex h-96 w-full max-w-xl flex-col gap-3">
			<ChatMessageList
				header={
					<div className="flex justify-center">
						<Button type="button" variant="ghost" size="sm">
							Charger les messages précédents
						</Button>
					</div>
				}
			>
				<ChatDateSeparator>Hier</ChatDateSeparator>
				<ChatMessageGroup align="start">
					<ChatMessageSender
						avatar={senderAvatar("CD")}
						name="Camille Dubois"
						badge={<Badge variant="provider">Professionnel de santé</Badge>}
					/>
					<ChatMessage variant="other">
						Bonjour, je serai sur place 30 minutes avant le match.
						<ChatMessageTime dateTime="2026-06-11T18:42">18:42</ChatMessageTime>
					</ChatMessage>
					<ChatMessage variant="other">
						Y a-t-il un local pour déposer mon matériel ?
						<ChatMessageTime dateTime="2026-06-11T18:43">18:43</ChatMessageTime>
					</ChatMessage>
				</ChatMessageGroup>
				<ChatMessageGroup align="start">
					<ChatMessageSender
						avatar={senderAvatar("NG")}
						name="Nathan Guyot"
						badge={<Badge variant="organization">RC Toulon</Badge>}
					/>
					<ChatMessage variant="other">
						Oui, le vestiaire arbitres est réservé pour vous.
						<ChatMessageTime dateTime="2026-06-11T19:05">19:05</ChatMessageTime>
					</ChatMessage>
				</ChatMessageGroup>
				<ChatDateSeparator>Aujourd'hui</ChatDateSeparator>
				<ChatMessageGroup align="start">
					<ChatMessageSender
						avatar={senderAvatar("ET")}
						name="Emilien"
						badge={<Badge>Équipe Acme</Badge>}
					/>
					<ChatMessage variant="other">
						Bonjour à tous, je reste disponible si besoin.
						<ChatMessageTime dateTime="2026-06-12T09:02">09:02</ChatMessageTime>
					</ChatMessage>
				</ChatMessageGroup>
				<ChatMessageGroup align="end">
					<ChatMessage variant="own">
						Parfait, merci ! À samedi.
						<ChatMessageTime dateTime="2026-06-12T09:10">09:10</ChatMessageTime>
					</ChatMessage>
				</ChatMessageGroup>
			</ChatMessageList>
		</div>
	),
};

/** A thread opened with unread messages: the destructive rule marks where
 * the catch-up starts. */
export const UnreadSeparator: Story = {
	render: () => (
		<div className="flex h-72 w-full max-w-xl flex-col gap-3">
			<ChatMessageList>
				<ChatMessageGroup align="end">
					<ChatMessage variant="own">
						À samedi !
						<ChatMessageTime dateTime="2026-06-11T19:10">19:10</ChatMessageTime>
					</ChatMessage>
				</ChatMessageGroup>
				<ChatUnreadSeparator>Nouveaux messages</ChatUnreadSeparator>
				<ChatMessageGroup align="start">
					<ChatMessageSender
						avatar={senderAvatar("CD")}
						name="Camille Dubois"
						badge={<Badge variant="provider">Professionnel de santé</Badge>}
					/>
					<ChatMessage variant="other">
						Petit changement : j'arriverai finalement à 13h30.
						<ChatMessageTime dateTime="2026-06-12T08:55">08:55</ChatMessageTime>
					</ChatMessage>
				</ChatMessageGroup>
			</ChatMessageList>
		</div>
	),
};

/** The overflow regression case: an unbroken URL must wrap inside the bubble
 * instead of stretching the whole list horizontally. */
export const LongWordOverflow: Story = {
	render: () => (
		<div className="flex h-72 w-full max-w-xl flex-col gap-3">
			<ChatMessageList>
				<ChatMessageGroup align="start">
					<ChatMessageSender
						avatar={senderAvatar("CD")}
						name="Camille Dubois"
					/>
					<ChatMessage variant="other">
						Voici le lien vers le protocole :
						https://intranet.acme.dev/protocoles/commotions-cerebrales/procedure-de-retour-au-jeu-progressive-2026
						<ChatMessageTime dateTime="2026-06-12T09:02">09:02</ChatMessageTime>
					</ChatMessage>
				</ChatMessageGroup>
				<ChatMessageGroup align="end">
					<ChatMessage variant="own">
						Supercalifragilisticexpialidocious-anticonstitutionnellement-extraordinairement
						<ChatMessageTime dateTime="2026-06-12T09:03">09:03</ChatMessageTime>
					</ChatMessage>
				</ChatMessageGroup>
			</ChatMessageList>
		</div>
	),
};

function MessageLinksPlayground() {
	const [pendingUrl, setPendingUrl] = useState<string | null>(null);
	return (
		<div className="flex h-72 w-full max-w-xl flex-col gap-3">
			<ChatMessageList>
				<ChatMessageGroup align="start">
					<ChatMessageSender
						avatar={senderAvatar("CD")}
						name="Camille Dubois"
						badge={<Badge variant="provider">Professionnel de santé</Badge>}
					/>
					<ChatMessage variant="other">
						<ChatMessageText onLinkClick={setPendingUrl}>
							Voici le protocole :
							https://www.rugby-protocoles.example.com/commotions. Dites-moi si
							le lien ne fonctionne pas.
						</ChatMessageText>
						<ChatMessageTime dateTime="2026-06-12T09:02">09:02</ChatMessageTime>
					</ChatMessage>
				</ChatMessageGroup>
				<ChatMessageGroup align="end">
					<ChatMessage variant="own">
						<ChatMessageText onLinkClick={setPendingUrl}>
							Merci ! Je préfère celui-ci :
							https://passeport.rugby.example.fr/retour-au-jeu
						</ChatMessageText>
						<ChatMessageTime dateTime="2026-06-12T09:04">09:04</ChatMessageTime>
					</ChatMessage>
				</ChatMessageGroup>
			</ChatMessageList>
			<ChatExternalLinkDialog
				url={pendingUrl}
				onClose={() => setPendingUrl(null)}
				title="Vous quittez acme.dev"
				description="Ce lien mène vers un site externe. Ouvrez-le uniquement si vous faites confiance à cette destination."
				confirmLabel="Ouvrir le lien"
				cancelLabel="Annuler"
			/>
		</div>
	);
}

/** URLs inside a message are clickable. Activation is intercepted by
 * ChatExternalLinkDialog: the reader confirms they trust the destination
 * before the link opens in a new tab. */
export const MessageLinks: Story = {
	render: () => <MessageLinksPlayground />,
};

/** What a conversation looks like before anyone has written. */
export const EmptyThread: Story = {
	render: () => (
		<div className="flex h-72 w-full max-w-xl flex-col gap-3">
			<ChatMessageList>
				<div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
					Aucun message pour le moment — écrivez le premier !
				</div>
			</ChatMessageList>
			<ChatComposer
				value=""
				onValueChange={() => {}}
				onSubmit={() => {}}
				placeholder="Écrire un message…"
				sendLabel="Envoyer"
				hint="⌘↵ pour envoyer"
			/>
		</div>
	),
};

function FollowPlayground() {
	const [messages, setMessages] = useState(
		Array.from(
			{ length: 20 },
			(_, index) => `Message d'historique #${index + 1}`,
		),
	);
	const [following, setFollowing] = useState(true);
	return (
		<div className="flex h-96 w-full max-w-xl flex-col gap-3">
			<ChatMessageList
				jumpToLatestLabel="Nouveaux messages"
				onFollowChange={setFollowing}
			>
				<ChatMessageGroup align="start">
					<ChatMessageSender
						avatar={senderAvatar("CD")}
						name="Camille Dubois"
						badge={<Badge variant="provider">Professionnel de santé</Badge>}
					/>
					{messages.map((message) => (
						<ChatMessage key={message} variant="other">
							{message}
						</ChatMessage>
					))}
				</ChatMessageGroup>
			</ChatMessageList>
			<div className="flex items-center justify-between gap-2">
				<span className="text-muted-foreground text-xs">
					{following
						? "Vous suivez la conversation."
						: "Vous lisez l'historique — un nouveau message affiche le bouton flottant."}
				</span>
				<Button
					type="button"
					size="sm"
					onClick={() =>
						setMessages((previous) => [
							...previous,
							`Nouveau message #${previous.length + 1}`,
						])
					}
				>
					Ajouter un message
				</Button>
			</div>
		</div>
	);
}

/** Scroll up into the history, then append: the list does not yank you down,
 * and the built-in « Nouveaux messages ↓ » button floats above the thread. */
export const FollowJumpToLatest: Story = {
	render: () => <FollowPlayground />,
};

function ComposerPlayground(props: {
	disabled?: boolean;
	sending?: boolean;
	submitOnEnter?: boolean;
	maxLength?: number;
}) {
	const [value, setValue] = useState("");
	return (
		<ChatComposer
			value={value}
			onValueChange={setValue}
			onSubmit={() => setValue("")}
			placeholder="Écrire un message…"
			sendLabel="Envoyer"
			hint={props.submitOnEnter ? "↵ pour envoyer" : "⌘↵ pour envoyer"}
			disabled={props.disabled}
			sending={props.sending}
			submitOnEnter={props.submitOnEnter}
			maxLength={props.maxLength}
		/>
	);
}

export const Composer: Story = {
	render: () => (
		<div className="w-full max-w-xl">
			<ComposerPlayground />
		</div>
	),
};

export const ComposerSending: Story = {
	render: () => (
		<div className="w-full max-w-xl">
			<ChatComposer
				value="J'arrive dans 10 minutes."
				onValueChange={() => {}}
				onSubmit={() => {}}
				sendLabel="Envoyer"
				sending
			/>
		</div>
	),
};

export const ComposerWithError: Story = {
	render: () => (
		<div className="w-full max-w-xl">
			<ChatComposer
				value={"Un message ".repeat(40)}
				onValueChange={() => {}}
				onSubmit={() => {}}
				placeholder="Écrire un message…"
				sendLabel="Envoyer"
				error="Le message dépasse la limite de 500 caractères."
				hint="⌘↵ pour envoyer"
			/>
		</div>
	),
};

/** Soft limit: the counter turns destructive and send is disabled once the
 * draft exceeds maxLength — type past 80 characters to see it. */
export const ComposerWithCounter: Story = {
	render: () => (
		<div className="flex w-full max-w-xl flex-col gap-6">
			<ComposerPlayground maxLength={80} />
			<ChatComposer
				value={"Un message vraiment trop long pour la limite fixée. ".repeat(2)}
				onValueChange={() => {}}
				onSubmit={() => {}}
				placeholder="Écrire un message…"
				sendLabel="Envoyer"
				maxLength={80}
				error="Le message dépasse la limite de 80 caractères."
			/>
		</div>
	),
};

export const ComposerSubmitOnEnter: Story = {
	render: () => (
		<div className="w-full max-w-xl">
			<ComposerPlayground submitOnEnter />
		</div>
	),
};

export const ComposerArchived: Story = {
	render: () => (
		<div className="flex w-full max-w-xl flex-col gap-2">
			<p className="text-muted-foreground text-sm">
				Cette conversation est archivée.
			</p>
			<ChatComposer
				value=""
				onValueChange={() => {}}
				onSubmit={() => {}}
				placeholder="Écrire un message…"
				sendLabel="Envoyer"
				disabled
			/>
		</div>
	),
};

export const ConversationListItems: Story = {
	render: () => (
		<div className="flex w-full max-w-xl flex-col gap-1">
			<ChatConversationItem
				leading={senderAvatar("SU")}
				title="Support"
				badges={<Badge variant="secondary">Support</Badge>}
				description="Notre équipe vous répond directement ici."
				timestamp="09:10"
				unreadCount={2}
			/>
			<ChatConversationItem
				leading={senderAvatar("T6")}
				title="Tournoi des 6 stations"
				badges={<Badge variant="outline">Événement</Badge>}
				description="Dernier message hier"
				timestamp="Hier"
			/>
			<ChatConversationItem
				leading={senderAvatar("RC")}
				title="Match RC Toulon — 12 avril"
				badges={
					<>
						<Badge variant="outline">Événement</Badge>
						<Badge variant="secondary">Archivée</Badge>
					</>
				}
				description="Conversation archivée"
				timestamp="12/04"
			/>
			{/* unreadCount above 99 renders as the capped « 99+ » badge. */}
			<ChatConversationItem
				leading={senderAvatar("DA")}
				title="Discussion très active avec un titre vraiment long qui doit être tronqué"
				description="Dernier message à l'instant"
				timestamp="À l'instant"
				unreadCount={128}
			/>
			<ChatConversationItem
				leading={senderAvatar("CL")}
				title="Conversation cliquable (lien)"
				description="Rendue comme un <a> via render — focus clavier et hover actifs."
				timestamp="10:24"
				unreadCount={1}
				render={
					// biome-ignore lint/a11y/useAnchorContent: content is merged in from ChatConversationItem
					<a href="#conversation" />
				}
			/>
		</div>
	),
};

function AppendPlayground() {
	const [messages, setMessages] = useState([
		"Bonjour, je serai sur place 30 minutes avant le match.",
		"Y a-t-il un local pour déposer mon matériel ?",
	]);
	return (
		<div className="flex h-96 w-full max-w-xl flex-col gap-3">
			<ChatMessageList>
				<ChatMessageGroup align="start">
					<ChatMessageSender
						avatar={senderAvatar("CD")}
						name="Camille Dubois"
						badge={<Badge variant="provider">Professionnel de santé</Badge>}
					/>
					{messages.map((message, index) => (
						<ChatMessage key={`${index}-${message}`} variant="other">
							{message}
							<ChatMessageTime>09:1{index}</ChatMessageTime>
						</ChatMessage>
					))}
				</ChatMessageGroup>
			</ChatMessageList>
			<Button
				type="button"
				size="sm"
				onClick={() =>
					setMessages((previous) => [
						...previous,
						`Nouveau message #${previous.length + 1}`,
					])
				}
			>
				Ajouter un message
			</Button>
		</div>
	);
}

export const AppendAutoScroll: Story = {
	render: () => <AppendPlayground />,
};
