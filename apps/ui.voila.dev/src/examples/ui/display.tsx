import {
	CalendarCheckIcon,
	CalendarIcon,
	FirstAidKitIcon,
} from "@phosphor-icons/react";
import { AspectRatio } from "@voila.dev/ui/components/aspect-ratio";
import {
	Avatar,
	AvatarBadge,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
} from "@voila.dev/ui/components/avatar";
import { Badge } from "@voila.dev/ui/components/badge";
import { Button } from "@voila.dev/ui/components/button";
import {
	ButtonGroup,
	ButtonGroupSeparator,
	ButtonGroupText,
} from "@voila.dev/ui/components/button-group";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@voila.dev/ui/components/card";
import {
	Carousel,
	CarouselContent,
	CarouselDots,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@voila.dev/ui/components/carousel";
import {
	ChatComposer,
	ChatConversationItem,
	ChatDateSeparator,
	ChatMessage,
	ChatMessageGroup,
	ChatMessageList,
	ChatMessageSender,
	ChatMessageTime,
} from "@voila.dev/ui/components/chat";
import { Chip, ChipRemove } from "@voila.dev/ui/components/chip";
import { CopyableText } from "@voila.dev/ui/components/copyable-text";
import { DirectionProvider } from "@voila.dev/ui/components/direction";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@voila.dev/ui/components/dropdown-menu";
import { Gallery } from "@voila.dev/ui/components/gallery";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@voila.dev/ui/components/item";
import { Kbd, KbdGroup } from "@voila.dev/ui/components/kbd";
import { List, ListItem } from "@voila.dev/ui/components/list";
import { ProfileHeader } from "@voila.dev/ui/components/profile-header";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@voila.dev/ui/components/resizable";
import { ScrollArea } from "@voila.dev/ui/components/scroll-area";
import {
	Section,
	SectionActions,
	SectionDescription,
	SectionHeader,
	SectionHeading,
	SectionTitle,
} from "@voila.dev/ui/components/section";
import { Separator } from "@voila.dev/ui/components/separator";
import { Shortcut } from "@voila.dev/ui/components/shortcut";
import {
	StatCard,
	StatCardDelta,
	StatCardHeader,
	StatCardLabel,
	StatCardValue,
} from "@voila.dev/ui/components/stat-card";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@voila.dev/ui/components/table";
import { UserAvatar } from "@voila.dev/ui/components/user-avatar";
import { useState } from "react";

const coverImage = `data:image/svg+xml;utf8,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="384" height="160"><rect width="384" height="160" fill="#1f6feb"/><text x="50%" y="50%" fill="white" font-family="sans-serif" font-size="20" text-anchor="middle" dy=".3em">Match day</text></svg>',
)}`;

/* -------------------------------------------------------------------------- */
/* Card                                                                       */
/* -------------------------------------------------------------------------- */

export function CardExample() {
	return (
		<Card className="w-full max-w-96">
			<CardHeader>
				<CardTitle>Physiotherapist — Match day</CardTitle>
				<CardDescription>
					Racing Club de Lyon · Saturday, June 20
				</CardDescription>
				<CardAction>
					<Badge>Open</Badge>
				</CardAction>
			</CardHeader>
			<CardContent>
				<p>
					Pitch-side coverage for the senior rugby team, including warm-up
					supervision and injury assessment.
				</p>
			</CardContent>
			<CardFooter className="justify-end gap-2">
				<Button variant="outline" size="sm">
					View details
				</Button>
				<Button size="sm">Apply</Button>
			</CardFooter>
		</Card>
	);
}

/* -------------------------------------------------------------------------- */
/* Avatars                                                                    */
/* -------------------------------------------------------------------------- */

export function AvatarExample() {
	return (
		<>
			<Avatar size="sm">
				<AvatarFallback>CD</AvatarFallback>
			</Avatar>
			<Avatar>
				<AvatarImage src="https://github.com/shadcn.png" alt="Camille Dubois" />
				<AvatarFallback>CD</AvatarFallback>
			</Avatar>
			<Avatar size="lg">
				<AvatarFallback>CD</AvatarFallback>
				<AvatarBadge />
			</Avatar>
			<AvatarGroup>
				<Avatar>
					<AvatarFallback>CD</AvatarFallback>
				</Avatar>
				<Avatar>
					<AvatarFallback>NG</AvatarFallback>
				</Avatar>
				<Avatar>
					<AvatarFallback>ML</AvatarFallback>
				</Avatar>
				<AvatarGroupCount>+4</AvatarGroupCount>
			</AvatarGroup>
		</>
	);
}

export function UserAvatarExample() {
	return (
		<div className="flex flex-col items-start gap-4">
			<UserAvatar
				name="Camille Dubois"
				description="Kinésithérapeute du sport"
				src="https://github.com/shadcn.png"
				status="online"
			/>
			<UserAvatar name="Nathan Guyot" description="Ostéopathe" size="sm" />
			<UserAvatar name="Marie Lefevre" size="lg" />
		</div>
	);
}

export function ProfileHeaderExample() {
	return (
		<ProfileHeader
			className="w-full rounded-xl border"
			name="Camille Dubois"
			headline="Kinésithérapeute du sport"
			theme="provider"
			avatar={{ src: "https://github.com/shadcn.png", name: "Camille Dubois" }}
			badges={
				<>
					<Badge variant="provider">Identité vérifiée</Badge>
					<Badge variant="secondary">Kinésithérapie</Badge>
				</>
			}
			actions={<Button size="sm">Contacter</Button>}
		/>
	);
}

/* -------------------------------------------------------------------------- */
/* StatCard                                                                   */
/* -------------------------------------------------------------------------- */

export function StatCardExample() {
	return (
		<div className="grid w-full gap-4 sm:grid-cols-2">
			<StatCard>
				<StatCardHeader>
					<StatCardLabel>Missions published</StatCardLabel>
				</StatCardHeader>
				<StatCardValue>38</StatCardValue>
				<StatCardDelta trend="up">+12% vs. last month</StatCardDelta>
			</StatCard>
			<StatCard>
				<StatCardHeader>
					<StatCardLabel>Cancellations</StatCardLabel>
				</StatCardHeader>
				<StatCardValue>17</StatCardValue>
				<StatCardDelta trend="down">-8% vs. last month</StatCardDelta>
			</StatCard>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Item and List                                                              */
/* -------------------------------------------------------------------------- */

export function ItemExample() {
	return (
		<Item variant="outline" className="w-full max-w-md">
			<ItemMedia variant="icon">
				<CalendarCheckIcon />
			</ItemMedia>
			<ItemContent>
				<ItemTitle>Saturday match coverage</ItemTitle>
				<ItemDescription>
					Physiotherapist needed for the senior rugby team, June 14 from 14:00
					to 18:00.
				</ItemDescription>
			</ItemContent>
			<ItemActions>
				<Button size="sm" variant="outline">
					Apply
				</Button>
			</ItemActions>
		</Item>
	);
}

export function ListExample() {
	return (
		<List aria-label="Open missions" className="w-full max-w-md">
			<ListItem variant="outline">
				<ItemMedia variant="icon">
					<CalendarCheckIcon />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>Saturday match coverage</ItemTitle>
					<ItemDescription>
						Physiotherapist for the senior rugby team, June 14.
					</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Button size="sm" variant="outline">
						Apply
					</Button>
				</ItemActions>
			</ListItem>
			<ListItem variant="outline">
				<ItemMedia variant="icon">
					<FirstAidKitIcon />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>Tournament first aid</ItemTitle>
					<ItemDescription>
						Two nurses for the youth handball tournament, June 21.
					</ItemDescription>
				</ItemContent>
				<ItemActions>
					<Button size="sm" variant="outline">
						Apply
					</Button>
				</ItemActions>
			</ListItem>
		</List>
	);
}

/* -------------------------------------------------------------------------- */
/* Table                                                                      */
/* -------------------------------------------------------------------------- */

const missions = [
	{
		reference: "MIS-001",
		club: "Stade Rochelais",
		status: "Confirmed",
		amount: "180.00 EUR",
	},
	{
		reference: "MIS-002",
		club: "RC Vannes",
		status: "Pending",
		amount: "240.00 EUR",
	},
	{
		reference: "MIS-003",
		club: "US Carcassonne",
		status: "Confirmed",
		amount: "150.00 EUR",
	},
];

export function TableExample() {
	return (
		<Table>
			<TableCaption>Recent missions for your organization.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Reference</TableHead>
					<TableHead>Club</TableHead>
					<TableHead>Status</TableHead>
					<TableHead className="text-right">Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{missions.map((mission) => (
					<TableRow key={mission.reference}>
						<TableCell className="font-medium">{mission.reference}</TableCell>
						<TableCell>{mission.club}</TableCell>
						<TableCell>{mission.status}</TableCell>
						<TableCell className="text-right">{mission.amount}</TableCell>
					</TableRow>
				))}
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell colSpan={3}>Total</TableCell>
					<TableCell className="text-right">570.00 EUR</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	);
}

/* -------------------------------------------------------------------------- */
/* Small display pieces                                                       */
/* -------------------------------------------------------------------------- */

export function SeparatorExample() {
	return (
		<div className="w-full max-w-72">
			<div className="space-y-1">
				<h4 className="font-medium text-sm">Mission details</h4>
				<p className="text-muted-foreground text-sm">
					Saturday match cover at Stade Rochelais.
				</p>
			</div>
			<Separator className="my-4" />
			<div className="flex h-5 items-center gap-4 text-sm">
				<span>Missions</span>
				<Separator orientation="vertical" />
				<span>Providers</span>
				<Separator orientation="vertical" />
				<span>Billing</span>
			</div>
			<Separator className="my-4">OU</Separator>
		</div>
	);
}

export function AspectRatioExample() {
	return (
		<div className="w-full max-w-96">
			<AspectRatio ratio={16 / 9}>
				<img
					src={coverImage}
					alt="Match day cover"
					className="size-full rounded-lg object-cover"
				/>
			</AspectRatio>
		</div>
	);
}

export function ChipExample() {
	return (
		<>
			<Chip variant="secondary">
				Kinésithérapie du sport
				<ChipRemove aria-label="Retirer Kinésithérapie du sport" />
			</Chip>
			<Chip variant="outline">Ostéopathie</Chip>
			<Chip variant="provider" size="sm">
				Nantes
				<ChipRemove aria-label="Retirer Nantes" />
			</Chip>
		</>
	);
}

export function KbdExample() {
	return (
		<>
			<Kbd>⌘K</Kbd>
			<Kbd size="sm">Esc</Kbd>
			<KbdGroup>
				<Kbd>⌘</Kbd>
				<Kbd>⇧</Kbd>
				<Kbd>P</Kbd>
			</KbdGroup>
		</>
	);
}

export function ShortcutExample() {
	return (
		<div className="flex w-full max-w-56 flex-col gap-2">
			<div className="flex items-center rounded-lg border px-3 py-2 text-sm">
				Rechercher
				<Shortcut>⌘K</Shortcut>
			</div>
			<div className="flex items-center rounded-lg border px-3 py-2 text-sm">
				Palette
				<Shortcut keys={["⌘", "K"]} />
			</div>
		</div>
	);
}

export function CopyableTextExample() {
	return (
		<div className="flex flex-col gap-2">
			<CopyableText value="camille@example.com" />
			<CopyableText value="+33690972105" muted />
			<CopyableText
				value="019f7557-04dd-7000-b488-d3f9a2647960"
				label="019f7557"
				className="text-xs"
			/>
		</div>
	);
}

export function ScrollAreaExample() {
	return (
		<ScrollArea className="h-56 w-full max-w-72 rounded-lg border">
			<div className="p-3">
				<p className="mb-2 font-medium text-sm">Upcoming missions</p>
				{Array.from({ length: 20 }, (_, index) => (
					<div
						key={`mission-${index + 1}`}
						className="border-b py-2 text-sm last:border-b-0"
					>
						Mission #{index + 1} — Match day coverage
					</div>
				))}
			</div>
		</ScrollArea>
	);
}

/* -------------------------------------------------------------------------- */
/* Media                                                                      */
/* -------------------------------------------------------------------------- */

const galleryImages = [
	{
		src: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80",
		alt: "Training session on the pitch",
	},
	{
		src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
		alt: "Athlete warming up",
	},
	{
		src: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
		alt: "Weight room",
	},
	{
		src: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
		alt: "Stadium at dusk",
	},
];

export function GalleryExample() {
	return <Gallery images={galleryImages} />;
}

export function CarouselExample() {
	return (
		<div className="mx-12 w-full max-w-xs">
			<Carousel opts={{ loop: true }}>
				<CarouselContent>
					{[1, 2, 3, 4, 5].map((slide) => (
						<CarouselItem key={slide}>
							<div className="flex aspect-square items-center justify-center rounded-xl bg-muted font-semibold text-4xl">
								{slide}
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious />
				<CarouselNext />
				<CarouselDots />
			</Carousel>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Layout                                                                     */
/* -------------------------------------------------------------------------- */

export function ResizableExample() {
	return (
		<div className="h-48 w-full max-w-xl">
			<ResizablePanelGroup className="rounded-lg border">
				<ResizablePanel defaultSize={50}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="font-medium text-sm">Mission list</span>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={50}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="font-medium text-sm">Mission details</span>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}

export function SectionExample() {
	return (
		<Section className="w-full">
			<SectionHeader>
				<SectionHeading>
					<SectionTitle>Prochaines missions</SectionTitle>
					<SectionDescription>
						Les missions de votre club cette semaine.
					</SectionDescription>
				</SectionHeading>
				<SectionActions>
					<Button variant="ghost" size="sm">
						Voir tout
					</Button>
				</SectionActions>
			</SectionHeader>
			<Card>
				<CardContent>Match senior — samedi 14 juin, 15h00</CardContent>
			</Card>
		</Section>
	);
}

export function ButtonGroupExample() {
	return (
		<div className="flex flex-col gap-4">
			<ButtonGroup>
				<Button variant="outline">Day</Button>
				<Button variant="outline">Week</Button>
				<Button variant="outline">Month</Button>
			</ButtonGroup>
			<ButtonGroup>
				<ButtonGroupText>
					<CalendarIcon />
				</ButtonGroupText>
				<ButtonGroupSeparator />
				<Button variant="outline">Cette semaine</Button>
			</ButtonGroup>
		</div>
	);
}

export function DirectionExample() {
	return (
		<DirectionProvider direction="rtl">
			<DropdownMenu>
				<DropdownMenuTrigger render={<Button variant="outline" />}>
					القائمة
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>تعديل المهمة</DropdownMenuItem>
					<DropdownMenuItem>نسخ</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</DirectionProvider>
	);
}

/* -------------------------------------------------------------------------- */
/* Chat                                                                       */
/* -------------------------------------------------------------------------- */

/** The composer is fully controlled: the parent owns the draft and the send. */
function Composer() {
	const [draft, setDraft] = useState("");
	return (
		<ChatComposer
			value={draft}
			onValueChange={setDraft}
			onSubmit={() => setDraft("")}
			placeholder="Écrivez votre message…"
			sendLabel="Envoyer"
		/>
	);
}

function senderAvatar(initials: string) {
	return (
		<Avatar size="sm">
			<AvatarFallback>{initials}</AvatarFallback>
		</Avatar>
	);
}

export function ChatExample() {
	return (
		<div className="flex h-96 w-full max-w-xl flex-col gap-3">
			<ChatMessageList>
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
				<ChatMessageGroup align="end">
					<ChatMessage variant="own">
						Oui, le vestiaire arbitres est réservé pour vous.
						<ChatMessageTime dateTime="2026-06-12T09:10">09:10</ChatMessageTime>
					</ChatMessage>
				</ChatMessageGroup>
			</ChatMessageList>
			<Composer />
		</div>
	);
}

export function ChatConversations() {
	return (
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
				leading={senderAvatar("RC")}
				title="Match RC Toulon — 12 avril"
				badges={<Badge variant="outline">Événement</Badge>}
				description="Conversation archivée"
				timestamp="12/04"
			/>
		</div>
	);
}
