import {
	CalendarCheckIcon,
	CalendarIcon,
	CodeIcon,
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
	'<svg xmlns="http://www.w3.org/2000/svg" width="384" height="160"><rect width="384" height="160" fill="#7c3aed"/><text x="50%" y="50%" fill="white" font-family="sans-serif" font-size="20" text-anchor="middle" dy=".3em">Launch day</text></svg>',
)}`;

/* -------------------------------------------------------------------------- */
/* Card                                                                       */
/* -------------------------------------------------------------------------- */

export function CardExample() {
	return (
		<Card className="w-full max-w-96">
			<CardHeader>
				<CardTitle>Product designer — Launch week</CardTitle>
				<CardDescription>Northgate Labs · Saturday, June 20</CardDescription>
				<CardAction>
					<Badge>Open</Badge>
				</CardAction>
			</CardHeader>
			<CardContent>
				<p>
					End-to-end design support for the launch sprint, including asset
					production and final design QA.
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
				description="Freelance product designer"
				src="https://github.com/shadcn.png"
				status="online"
			/>
			<UserAvatar name="Nathan Guyot" description="Developer" size="sm" />
			<UserAvatar name="Marie Lefevre" size="lg" />
		</div>
	);
}

export function ProfileHeaderExample() {
	return (
		<ProfileHeader
			className="w-full rounded-xl border"
			name="Camille Dubois"
			headline="Freelance product designer"
			theme="brand"
			avatar={{ src: "https://github.com/shadcn.png", name: "Camille Dubois" }}
			badges={
				<>
					<Badge variant="brand">Identity verified</Badge>
					<Badge variant="secondary">Product design</Badge>
				</>
			}
			actions={<Button size="sm">Contact</Button>}
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
					<StatCardLabel>Projects published</StatCardLabel>
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
				<ItemTitle>Landing page redesign</ItemTitle>
				<ItemDescription>
					Designer needed for the marketing site refresh, June 14 through June
					18.
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
		<List aria-label="Open projects" className="w-full max-w-md">
			<ListItem variant="outline">
				<ItemMedia variant="icon">
					<CalendarCheckIcon />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>Landing page redesign</ItemTitle>
					<ItemDescription>
						Designer for the marketing site refresh, June 14.
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
					<CodeIcon />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>API integration sprint</ItemTitle>
					<ItemDescription>
						Two developers for the billing API integration, June 21.
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

const projects = [
	{
		reference: "PRJ-001",
		client: "Northwind Trading",
		status: "Confirmed",
		amount: "180.00 USD",
	},
	{
		reference: "PRJ-002",
		client: "Globex Media",
		status: "Pending",
		amount: "240.00 USD",
	},
	{
		reference: "PRJ-003",
		client: "Initech Systems",
		status: "Confirmed",
		amount: "150.00 USD",
	},
];

export function TableExample() {
	return (
		<Table>
			<TableCaption>Recent projects for your workspace.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Reference</TableHead>
					<TableHead>Client</TableHead>
					<TableHead>Status</TableHead>
					<TableHead className="text-right">Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{projects.map((project) => (
					<TableRow key={project.reference}>
						<TableCell className="font-medium">{project.reference}</TableCell>
						<TableCell>{project.client}</TableCell>
						<TableCell>{project.status}</TableCell>
						<TableCell className="text-right">{project.amount}</TableCell>
					</TableRow>
				))}
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell colSpan={3}>Total</TableCell>
					<TableCell className="text-right">570.00 USD</TableCell>
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
				<h4 className="font-medium text-sm">Project details</h4>
				<p className="text-muted-foreground text-sm">
					Landing page redesign for Northwind Trading.
				</p>
			</div>
			<Separator className="my-4" />
			<div className="flex h-5 items-center gap-4 text-sm">
				<span>Projects</span>
				<Separator orientation="vertical" />
				<span>Freelancers</span>
				<Separator orientation="vertical" />
				<span>Billing</span>
			</div>
			<Separator className="my-4">OR</Separator>
		</div>
	);
}

export function AspectRatioExample() {
	return (
		<div className="w-full max-w-96">
			<AspectRatio ratio={16 / 9}>
				<img
					src={coverImage}
					alt="Launch day cover"
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
				Product design
				<ChipRemove aria-label="Remove Product design" />
			</Chip>
			<Chip variant="outline">Development</Chip>
			<Chip variant="brand" size="sm">
				Remote
				<ChipRemove aria-label="Remove Remote" />
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
				Search
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
				<p className="mb-2 font-medium text-sm">Upcoming projects</p>
				{Array.from({ length: 20 }, (_, index) => (
					<div
						key={`project-${index + 1}`}
						className="border-b py-2 text-sm last:border-b-0"
					>
						Project #{index + 1} — Landing page sprint
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
		src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
		alt: "Bright open-plan office",
	},
	{
		src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
		alt: "Team collaborating at a desk",
	},
	{
		src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
		alt: "Laptop with code on screen",
	},
	{
		src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
		alt: "Planning notes on a desk",
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
						<span className="font-medium text-sm">Project list</span>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={50}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="font-medium text-sm">Project details</span>
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
					<SectionTitle>Upcoming projects</SectionTitle>
					<SectionDescription>
						Your workspace's projects this week.
					</SectionDescription>
				</SectionHeading>
				<SectionActions>
					<Button variant="ghost" size="sm">
						View all
					</Button>
				</SectionActions>
			</SectionHeader>
			<Card>
				<CardContent>Design review — Saturday, June 14, 3:00 pm</CardContent>
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
				<Button variant="outline">This week</Button>
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
			placeholder="Write your message…"
			sendLabel="Send"
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
				<ChatDateSeparator>Yesterday</ChatDateSeparator>
				<ChatMessageGroup align="start">
					<ChatMessageSender
						avatar={senderAvatar("CD")}
						name="Camille Dubois"
						badge={<Badge variant="brand">Verified freelancer</Badge>}
					/>
					<ChatMessage variant="other">
						Hi, I will share the first drafts before our call tomorrow.
						<ChatMessageTime dateTime="2026-06-11T18:42">18:42</ChatMessageTime>
					</ChatMessage>
					<ChatMessage variant="other">
						Is there a shared folder where I can drop the files?
						<ChatMessageTime dateTime="2026-06-11T18:43">18:43</ChatMessageTime>
					</ChatMessage>
				</ChatMessageGroup>
				<ChatMessageGroup align="end">
					<ChatMessage variant="own">
						Yes, the project drive is already shared with you.
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
				description="Our team replies to you directly here."
				timestamp="09:10"
				unreadCount={2}
			/>
			<ChatConversationItem
				leading={senderAvatar("RC")}
				title="Website launch — April 12"
				badges={<Badge variant="outline">Milestone</Badge>}
				description="Archived conversation"
				timestamp="12/04"
			/>
		</div>
	);
}
