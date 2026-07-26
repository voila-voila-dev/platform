import {
	CalendarCheckIcon,
	CalendarIcon,
	CodeIcon,
} from "@phosphor-icons/react";
import { AspectRatio } from "@voila.dev/ui/aspect-ratio";
import { Avatar } from "@voila.dev/ui/avatar";
import { Badge } from "@voila.dev/ui/badge";
import { Button } from "@voila.dev/ui/button";
import { ButtonGroup } from "@voila.dev/ui/button-group";
import { Card } from "@voila.dev/ui/card";
import { Carousel } from "@voila.dev/ui/carousel";
import { Chat } from "@voila.dev/ui/chat";
import { Chip } from "@voila.dev/ui/chip";
import { CopyableText } from "@voila.dev/ui/copyable-text";
import { DirectionProvider } from "@voila.dev/ui/direction";
import { DropdownMenu } from "@voila.dev/ui/dropdown-menu";
import { Gallery } from "@voila.dev/ui/gallery";
import { Item } from "@voila.dev/ui/item";
import { Kbd } from "@voila.dev/ui/kbd";
import { List } from "@voila.dev/ui/list";
import { ProfileHeader } from "@voila.dev/ui/profile-header";
import { Resizable } from "@voila.dev/ui/resizable";
import { ScrollArea } from "@voila.dev/ui/scroll-area";
import { Section } from "@voila.dev/ui/section";
import { Separator } from "@voila.dev/ui/separator";
import { Shortcut } from "@voila.dev/ui/shortcut";
import { StatCard } from "@voila.dev/ui/stat-card";
import { Table } from "@voila.dev/ui/table";
import { UserAvatar } from "@voila.dev/ui/user-avatar";
import { useState } from "react";

const coverImage = `data:image/svg+xml;utf8,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="384" height="160"><rect width="384" height="160" fill="#7c3aed"/><text x="50%" y="50%" fill="white" font-family="sans-serif" font-size="20" text-anchor="middle" dy=".3em">Launch day</text></svg>',
)}`;

/* -------------------------------------------------------------------------- */
/* Card                                                                       */
/* -------------------------------------------------------------------------- */

export function CardExample() {
	return (
		<Card.Root className="w-full max-w-96">
			<Card.Header>
				<Card.Title>Product designer — Launch week</Card.Title>
				<Card.Description>Northgate Labs · Saturday, June 20</Card.Description>
				<Card.Action>
					<Badge>Open</Badge>
				</Card.Action>
			</Card.Header>
			<Card.Content>
				<p>
					End-to-end design support for the launch sprint, including asset
					production and final design QA.
				</p>
			</Card.Content>
			<Card.Footer className="justify-end gap-2">
				<Button variant="outline" size="sm">
					View details
				</Button>
				<Button size="sm">Apply</Button>
			</Card.Footer>
		</Card.Root>
	);
}

/* -------------------------------------------------------------------------- */
/* Avatars                                                                    */
/* -------------------------------------------------------------------------- */

export function AvatarExample() {
	return (
		<>
			<Avatar.Root size="sm">
				<Avatar.Fallback>CD</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root>
				<Avatar.Image
					src="https://github.com/shadcn.png"
					alt="Camille Dubois"
				/>
				<Avatar.Fallback>CD</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root size="lg">
				<Avatar.Fallback>CD</Avatar.Fallback>
				<Avatar.Badge />
			</Avatar.Root>
			<Avatar.Group>
				<Avatar.Root>
					<Avatar.Fallback>CD</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.Root>
					<Avatar.Fallback>NG</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.Root>
					<Avatar.Fallback>ML</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.GroupCount>+4</Avatar.GroupCount>
			</Avatar.Group>
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
		<ProfileHeader.Root
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
			<StatCard.Root>
				<StatCard.Header>
					<StatCard.Label>Projects published</StatCard.Label>
				</StatCard.Header>
				<StatCard.Value>38</StatCard.Value>
				<StatCard.Delta trend="up">+12% vs. last month</StatCard.Delta>
			</StatCard.Root>
			<StatCard.Root>
				<StatCard.Header>
					<StatCard.Label>Cancellations</StatCard.Label>
				</StatCard.Header>
				<StatCard.Value>17</StatCard.Value>
				<StatCard.Delta trend="down">-8% vs. last month</StatCard.Delta>
			</StatCard.Root>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Item and List                                                              */
/* -------------------------------------------------------------------------- */

export function ItemExample() {
	return (
		<Item.Root variant="outline" className="w-full max-w-md">
			<Item.Media variant="icon">
				<CalendarCheckIcon />
			</Item.Media>
			<Item.Content>
				<Item.Title>Landing page redesign</Item.Title>
				<Item.Description>
					Designer needed for the marketing site refresh, June 14 through June
					18.
				</Item.Description>
			</Item.Content>
			<Item.Actions>
				<Button size="sm" variant="outline">
					Apply
				</Button>
			</Item.Actions>
		</Item.Root>
	);
}

export function ListExample() {
	return (
		<List.Root aria-label="Open projects" className="w-full max-w-md">
			<List.Item variant="outline">
				<Item.Media variant="icon">
					<CalendarCheckIcon />
				</Item.Media>
				<Item.Content>
					<Item.Title>Landing page redesign</Item.Title>
					<Item.Description>
						Designer for the marketing site refresh, June 14.
					</Item.Description>
				</Item.Content>
				<Item.Actions>
					<Button size="sm" variant="outline">
						Apply
					</Button>
				</Item.Actions>
			</List.Item>
			<List.Item variant="outline">
				<Item.Media variant="icon">
					<CodeIcon />
				</Item.Media>
				<Item.Content>
					<Item.Title>API integration sprint</Item.Title>
					<Item.Description>
						Two developers for the billing API integration, June 21.
					</Item.Description>
				</Item.Content>
				<Item.Actions>
					<Button size="sm" variant="outline">
						Apply
					</Button>
				</Item.Actions>
			</List.Item>
		</List.Root>
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
		<Table.Root>
			<Table.Caption>Recent projects for your workspace.</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head>Reference</Table.Head>
					<Table.Head>Client</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head className="text-right">Amount</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{projects.map((project) => (
					<Table.Row key={project.reference}>
						<Table.Cell className="font-medium">{project.reference}</Table.Cell>
						<Table.Cell>{project.client}</Table.Cell>
						<Table.Cell>{project.status}</Table.Cell>
						<Table.Cell className="text-right">{project.amount}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
			<Table.Footer>
				<Table.Row>
					<Table.Cell colSpan={3}>Total</Table.Cell>
					<Table.Cell className="text-right">570.00 USD</Table.Cell>
				</Table.Row>
			</Table.Footer>
		</Table.Root>
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
			<Chip.Root variant="secondary">
				Product design
				<Chip.Remove aria-label="Remove Product design" />
			</Chip.Root>
			<Chip.Root variant="outline">Development</Chip.Root>
			<Chip.Root variant="brand" size="sm">
				Remote
				<Chip.Remove aria-label="Remove Remote" />
			</Chip.Root>
		</>
	);
}

export function KbdExample() {
	return (
		<>
			<Kbd.Root>⌘K</Kbd.Root>
			<Kbd.Root size="sm">Esc</Kbd.Root>
			<Kbd.Group>
				<Kbd.Root>⌘</Kbd.Root>
				<Kbd.Root>⇧</Kbd.Root>
				<Kbd.Root>P</Kbd.Root>
			</Kbd.Group>
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
		<ScrollArea.Root className="h-56 w-full max-w-72 rounded-lg border">
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
		</ScrollArea.Root>
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
	return <Gallery.Root images={galleryImages} />;
}

export function CarouselExample() {
	return (
		<div className="mx-12 w-full max-w-xs">
			<Carousel.Root opts={{ loop: true }}>
				<Carousel.Content>
					{[1, 2, 3, 4, 5].map((slide) => (
						<Carousel.Item key={slide}>
							<div className="flex aspect-square items-center justify-center rounded-xl bg-muted font-semibold text-4xl">
								{slide}
							</div>
						</Carousel.Item>
					))}
				</Carousel.Content>
				<Carousel.Previous />
				<Carousel.Next />
				<Carousel.Dots />
			</Carousel.Root>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Layout                                                                     */
/* -------------------------------------------------------------------------- */

export function ResizableExample() {
	return (
		<div className="h-48 w-full max-w-xl">
			<Resizable.PanelGroup className="rounded-lg border">
				<Resizable.Panel defaultSize={50}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="font-medium text-sm">Project list</span>
					</div>
				</Resizable.Panel>
				<Resizable.Handle withHandle />
				<Resizable.Panel defaultSize={50}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="font-medium text-sm">Project details</span>
					</div>
				</Resizable.Panel>
			</Resizable.PanelGroup>
		</div>
	);
}

export function SectionExample() {
	return (
		<Section.Root className="w-full">
			<Section.Header>
				<Section.Heading>
					<Section.Title>Upcoming projects</Section.Title>
					<Section.Description>
						Your workspace's projects this week.
					</Section.Description>
				</Section.Heading>
				<Section.Actions>
					<Button variant="ghost" size="sm">
						View all
					</Button>
				</Section.Actions>
			</Section.Header>
			<Card.Root>
				<Card.Content>Design review — Saturday, June 14, 3:00 pm</Card.Content>
			</Card.Root>
		</Section.Root>
	);
}

export function ButtonGroupExample() {
	return (
		<div className="flex flex-col gap-4">
			<ButtonGroup.Root>
				<Button variant="outline">Day</Button>
				<Button variant="outline">Week</Button>
				<Button variant="outline">Month</Button>
			</ButtonGroup.Root>
			<ButtonGroup.Root>
				<ButtonGroup.Text>
					<CalendarIcon />
				</ButtonGroup.Text>
				<ButtonGroup.Separator />
				<Button variant="outline">This week</Button>
			</ButtonGroup.Root>
		</div>
	);
}

export function DirectionExample() {
	return (
		<DirectionProvider direction="rtl">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger render={<Button variant="outline" />}>
					القائمة
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Item>تعديل المهمة</DropdownMenu.Item>
					<DropdownMenu.Item>نسخ</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
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
		<Chat.Composer
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
		<Avatar.Root size="sm">
			<Avatar.Fallback>{initials}</Avatar.Fallback>
		</Avatar.Root>
	);
}

export function ChatExample() {
	return (
		<div className="flex h-96 w-full max-w-xl flex-col gap-3">
			<Chat.MessageList>
				<Chat.DateSeparator>Yesterday</Chat.DateSeparator>
				<Chat.MessageGroup align="start">
					<Chat.MessageSender
						avatar={senderAvatar("CD")}
						name="Camille Dubois"
						badge={<Badge variant="brand">Verified freelancer</Badge>}
					/>
					<Chat.Message variant="other">
						Hi, I will share the first drafts before our call tomorrow.
						<Chat.MessageTime dateTime="2026-06-11T18:42">
							18:42
						</Chat.MessageTime>
					</Chat.Message>
					<Chat.Message variant="other">
						Is there a shared folder where I can drop the files?
						<Chat.MessageTime dateTime="2026-06-11T18:43">
							18:43
						</Chat.MessageTime>
					</Chat.Message>
				</Chat.MessageGroup>
				<Chat.MessageGroup align="end">
					<Chat.Message variant="own">
						Yes, the project drive is already shared with you.
						<Chat.MessageTime dateTime="2026-06-12T09:10">
							09:10
						</Chat.MessageTime>
					</Chat.Message>
				</Chat.MessageGroup>
			</Chat.MessageList>
			<Composer />
		</div>
	);
}

export function ChatConversations() {
	return (
		<div className="flex w-full max-w-xl flex-col gap-1">
			<Chat.ConversationItem
				leading={senderAvatar("SU")}
				title="Support"
				badges={<Badge variant="secondary">Support</Badge>}
				description="Our team replies to you directly here."
				timestamp="09:10"
				unreadCount={2}
			/>
			<Chat.ConversationItem
				leading={senderAvatar("RC")}
				title="Website launch — April 12"
				badges={<Badge variant="outline">Milestone</Badge>}
				description="Archived conversation"
				timestamp="12/04"
			/>
		</div>
	);
}
