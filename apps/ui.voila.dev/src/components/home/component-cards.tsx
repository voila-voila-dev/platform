import { Chart, type ChartConfig } from "@voila.dev/ui/chart/chart";
import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
} from "@voila.dev/ui/components/avatar";
import { Badge } from "@voila.dev/ui/components/badge";
import { Button } from "@voila.dev/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@voila.dev/ui/components/card";
import { Checkbox } from "@voila.dev/ui/components/checkbox";
import { DatePicker } from "@voila.dev/ui/components/date-picker";
import { Field, FieldLabel } from "@voila.dev/ui/components/field";
import { Input } from "@voila.dev/ui/components/input";
import { Label } from "@voila.dev/ui/components/label";
import {
	Progress,
	ProgressLabel,
	ProgressValue,
} from "@voila.dev/ui/components/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@voila.dev/ui/components/select";
import { Slider } from "@voila.dev/ui/components/slider";
import {
	StatCard,
	StatCardChart,
	StatCardDelta,
	StatCardHeader,
	StatCardLabel,
	StatCardValue,
} from "@voila.dev/ui/components/stat-card";
import { Switch } from "@voila.dev/ui/components/switch";
import { useState } from "react";

const revenueData = [
	{ month: "Feb", mrr: 8.1 },
	{ month: "Mar", mrr: 9.4 },
	{ month: "Apr", mrr: 9.0 },
	{ month: "May", mrr: 10.8 },
	{ month: "Jun", mrr: 12.1 },
	{ month: "Jul", mrr: 13.6 },
];

const revenueConfig = {
	mrr: { label: "MRR", color: "var(--chart-1)" },
} satisfies ChartConfig;

const alertPreferences = [
	{
		id: "home-alert-transactions",
		title: "Transaction alerts",
		description: "Deposits, withdrawals and transfers.",
		defaultChecked: true,
	},
	{
		id: "home-alert-security",
		title: "Security alerts",
		description: "Login attempts and account changes.",
		defaultChecked: true,
	},
	{
		id: "home-alert-digest",
		title: "Weekly digest",
		description: "A summary every Monday morning.",
		defaultChecked: false,
	},
];

const teammates = [
	{ initials: "AD", name: "Ada Lovelace", role: "Owner" },
	{ initials: "GH", name: "Grace Hopper", role: "Admin" },
	{ initials: "AT", name: "Alan Turing", role: "Member" },
];

/** The "set a goal" form: fields, a picker, a select and the action row. */
function MilestoneCard() {
	const [targetDate, setTargetDate] = useState<Date | null>(
		new Date(2026, 11, 1),
	);
	return (
		<Card>
			<CardHeader>
				<CardTitle>Set a new milestone</CardTitle>
				<CardDescription>
					Define your target and we'll help you pace it.
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4">
				<Field>
					<FieldLabel htmlFor="home-goal-name">Goal name</FieldLabel>
					<Input id="home-goal-name" placeholder="e.g. Series A runway" />
				</Field>
				<div className="grid gap-4 sm:grid-cols-2">
					<Field>
						<FieldLabel htmlFor="home-goal-amount">Target amount</FieldLabel>
						<Input id="home-goal-amount" defaultValue="$15,000" />
					</Field>
					<Field>
						<FieldLabel>Target date</FieldLabel>
						<DatePicker
							value={targetDate}
							onValueChange={setTargetDate}
							className="w-full min-w-0"
							placeholder="Pick a date"
							calendarProps={{ defaultMonth: new Date(2026, 11, 1) }}
						/>
					</Field>
				</div>
				<Field>
					<FieldLabel>Priority</FieldLabel>
					<Select defaultValue="high">
						<SelectTrigger className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="high">High — check in weekly</SelectItem>
							<SelectItem value="medium">Medium — monthly review</SelectItem>
							<SelectItem value="low">Low — best effort</SelectItem>
						</SelectContent>
					</Select>
				</Field>
			</CardContent>
			<CardFooter className="grid gap-2">
				<Button className="w-full">Create goal</Button>
				<Button variant="ghost" className="w-full">
					Cancel
				</Button>
			</CardFooter>
		</Card>
	);
}

/** A dashboard KPI tile with a live SVG chart from ui-chart underneath. */
function RevenueCard() {
	return (
		<StatCard>
			<StatCardHeader>
				<StatCardLabel>Monthly recurring revenue</StatCardLabel>
				<StatCardDelta trend="up">+12.4%</StatCardDelta>
			</StatCardHeader>
			<StatCardValue>$13,600</StatCardValue>
			<StatCardChart>
				<Chart.Root
					config={revenueConfig}
					data={revenueData}
					x={{ key: "month" }}
					y={{ keys: ["mrr"] }}
					className="h-24 w-full"
					margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
				>
					<Chart.Bars />
				</Chart.Root>
			</StatCardChart>
		</StatCard>
	);
}

function NotificationsCard() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Notifications</CardTitle>
				<CardDescription>
					Choose which alerts you want to receive.
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-5">
				{alertPreferences.map((preference) => (
					<div key={preference.id} className="flex items-start gap-3">
						<Switch
							id={preference.id}
							defaultChecked={preference.defaultChecked}
						/>
						<div className="grid gap-0.5">
							<Label htmlFor={preference.id}>{preference.title}</Label>
							<p className="text-sm text-muted-foreground">
								{preference.description}
							</p>
						</div>
					</div>
				))}
			</CardContent>
			<CardFooter>
				<Button variant="outline" className="w-full">
					Save preferences
				</Button>
			</CardFooter>
		</Card>
	);
}

function StorageCard() {
	const [threshold, setThreshold] = useState<number | readonly number[]>(2500);
	const amount = Array.isArray(threshold)
		? threshold[0]
		: (threshold as number);
	return (
		<Card>
			<CardHeader>
				<CardTitle>Payout threshold</CardTitle>
				<CardDescription>
					Minimum balance required before a payout is triggered.
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-6">
				<div className="grid gap-3">
					<p className="text-2xl font-semibold tracking-tight tabular-nums">
						${amount.toLocaleString("en-US")}
					</p>
					<Slider
						value={threshold}
						onValueChange={setThreshold}
						min={50}
						max={10000}
						step={50}
					/>
					<div className="flex justify-between text-xs text-muted-foreground">
						<span>$50 (min)</span>
						<span>$10,000 (max)</span>
					</div>
				</div>
				<Progress value={1211} max={2500}>
					<ProgressLabel>Ready to claim</ProgressLabel>
					<ProgressValue>{() => "$1,211 / $2,500"}</ProgressValue>
				</Progress>
			</CardContent>
			<CardFooter>
				<Button className="w-full">Save threshold</Button>
			</CardFooter>
		</Card>
	);
}

function TeamCard() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Team</CardTitle>
				<CardDescription>Invite and manage who has access.</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4">
				<div className="flex gap-2">
					<Input placeholder="teammate@company.com" aria-label="Email" />
					<Button variant="secondary">Invite</Button>
				</div>
				<div className="grid gap-3">
					{teammates.map((member) => (
						<div key={member.name} className="flex items-center gap-3">
							<Avatar>
								<AvatarFallback>{member.initials}</AvatarFallback>
							</Avatar>
							<p className="flex-1 truncate text-sm font-medium">
								{member.name}
							</p>
							<Badge variant={member.role === "Owner" ? "default" : "outline"}>
								{member.role}
							</Badge>
						</div>
					))}
				</div>
			</CardContent>
			<CardFooter className="justify-between">
				<AvatarGroup>
					{teammates.map((member) => (
						<Avatar key={member.initials}>
							<AvatarFallback>{member.initials}</AvatarFallback>
						</Avatar>
					))}
					<AvatarGroupCount>+5</AvatarGroupCount>
				</AvatarGroup>
				<Button variant="ghost" size="sm">
					Manage roles
				</Button>
			</CardFooter>
		</Card>
	);
}

/** The raw primitives, so the grid also reads as a component inventory. */
function PrimitivesCard() {
	const [agreed, setAgreed] = useState(true);
	return (
		<Card>
			<CardHeader>
				<CardTitle>The primitives underneath</CardTitle>
				<CardDescription>
					Every card on this row is built from these.
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-5">
				<div className="flex flex-wrap items-center gap-2">
					<Button size="sm">Default</Button>
					<Button size="sm" variant="secondary">
						Secondary
					</Button>
					<Button size="sm" variant="outline">
						Outline
					</Button>
					<Button size="sm" loading>
						Saving…
					</Button>
				</div>
				<div className="flex flex-wrap items-center gap-2">
					<Badge>Default</Badge>
					<Badge variant="secondary">Secondary</Badge>
					<Badge variant="outline">Outline</Badge>
					<Badge variant="destructive">Destructive</Badge>
				</div>
				<div className="flex items-center gap-3">
					<Checkbox
						id="home-primitives-terms"
						checked={agreed}
						onCheckedChange={(checked) => setAgreed(checked === true)}
					/>
					<Label htmlFor="home-primitives-terms">Accept terms</Label>
					<Switch
						id="home-primitives-switch"
						defaultChecked
						className="ml-auto"
					/>
				</div>
			</CardContent>
		</Card>
	);
}

/**
 * The shadcn-style "components at work" wall: real product surfaces (a form,
 * a KPI tile, settings, a team list) composed from the library, not screenshots.
 */
export function ComponentCards() {
	return (
		<div className="mx-auto grid max-w-6xl items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
			<div className="grid gap-4">
				<MilestoneCard />
				<PrimitivesCard />
			</div>
			<div className="grid gap-4">
				<RevenueCard />
				<NotificationsCard />
			</div>
			<div className="grid gap-4 md:col-span-2 md:grid-cols-2 xl:col-span-1 xl:grid-cols-1">
				<StorageCard />
				<TeamCard />
			</div>
		</div>
	);
}
