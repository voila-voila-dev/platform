import { Avatar } from "@voila.dev/ui/avatar";
import { Badge } from "@voila.dev/ui/badge";
import { Button } from "@voila.dev/ui/button";
import { Card } from "@voila.dev/ui/card";
import { Chart, type ChartConfig } from "@voila.dev/ui/chart";
import { Checkbox } from "@voila.dev/ui/checkbox";
import { DatePicker } from "@voila.dev/ui/date-picker";
import { Field } from "@voila.dev/ui/field";
import { Input } from "@voila.dev/ui/input";
import { Label } from "@voila.dev/ui/label";
import { Progress } from "@voila.dev/ui/progress";
import { Select } from "@voila.dev/ui/select";
import { Slider } from "@voila.dev/ui/slider";
import { StatCard } from "@voila.dev/ui/stat-card";
import { Switch } from "@voila.dev/ui/switch";
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
		<Card.Root>
			<Card.Header>
				<Card.Title>Set a new milestone</Card.Title>
				<Card.Description>
					Define your target and we'll help you pace it.
				</Card.Description>
			</Card.Header>
			<Card.Content className="grid gap-4">
				<Field.Root>
					<Field.Label htmlFor="home-goal-name">Goal name</Field.Label>
					<Input id="home-goal-name" placeholder="e.g. Series A runway" />
				</Field.Root>
				<div className="grid gap-4 sm:grid-cols-2">
					<Field.Root>
						<Field.Label htmlFor="home-goal-amount">Target amount</Field.Label>
						<Input id="home-goal-amount" defaultValue="$15,000" />
					</Field.Root>
					<Field.Root>
						<Field.Label>Target date</Field.Label>
						<DatePicker.Root
							value={targetDate}
							onValueChange={setTargetDate}
							className="w-full min-w-0"
							placeholder="Pick a date"
							calendarProps={{ defaultMonth: new Date(2026, 11, 1) }}
						/>
					</Field.Root>
				</div>
				<Field.Root>
					<Field.Label>Priority</Field.Label>
					<Select.Root defaultValue="high">
						<Select.Trigger className="w-full">
							<Select.Value />
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="high">High — check in weekly</Select.Item>
							<Select.Item value="medium">Medium — monthly review</Select.Item>
							<Select.Item value="low">Low — best effort</Select.Item>
						</Select.Content>
					</Select.Root>
				</Field.Root>
			</Card.Content>
			<Card.Footer className="grid gap-2">
				<Button className="w-full">Create goal</Button>
				<Button variant="ghost" className="w-full">
					Cancel
				</Button>
			</Card.Footer>
		</Card.Root>
	);
}

/** A dashboard KPI tile with a live SVG chart from ui-chart underneath. */
function RevenueCard() {
	return (
		<StatCard.Root>
			<StatCard.Header>
				<StatCard.Label>Monthly recurring revenue</StatCard.Label>
				<StatCard.Delta trend="up">+12.4%</StatCard.Delta>
			</StatCard.Header>
			<StatCard.Value>$13,600</StatCard.Value>
			<StatCard.Chart>
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
			</StatCard.Chart>
		</StatCard.Root>
	);
}

function NotificationsCard() {
	return (
		<Card.Root>
			<Card.Header>
				<Card.Title>Notifications</Card.Title>
				<Card.Description>
					Choose which alerts you want to receive.
				</Card.Description>
			</Card.Header>
			<Card.Content className="grid gap-5">
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
			</Card.Content>
			<Card.Footer>
				<Button variant="outline" className="w-full">
					Save preferences
				</Button>
			</Card.Footer>
		</Card.Root>
	);
}

function StorageCard() {
	const [threshold, setThreshold] = useState<number | readonly number[]>(2500);
	const amount = Array.isArray(threshold)
		? threshold[0]
		: (threshold as number);
	return (
		<Card.Root>
			<Card.Header>
				<Card.Title>Payout threshold</Card.Title>
				<Card.Description>
					Minimum balance required before a payout is triggered.
				</Card.Description>
			</Card.Header>
			<Card.Content className="grid gap-6">
				<div className="grid gap-3">
					<p className="text-2xl font-semibold tracking-tight tabular-nums">
						${amount.toLocaleString("en-US")}
					</p>
					<Slider.Root
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
				<Progress.Root value={1211} max={2500}>
					<Progress.Label>Ready to claim</Progress.Label>
					<Progress.Value>{() => "$1,211 / $2,500"}</Progress.Value>
				</Progress.Root>
			</Card.Content>
			<Card.Footer>
				<Button className="w-full">Save threshold</Button>
			</Card.Footer>
		</Card.Root>
	);
}

function TeamCard() {
	return (
		<Card.Root>
			<Card.Header>
				<Card.Title>Team</Card.Title>
				<Card.Description>Invite and manage who has access.</Card.Description>
			</Card.Header>
			<Card.Content className="grid gap-4">
				<div className="flex gap-2">
					<Input placeholder="teammate@company.com" aria-label="Email" />
					<Button variant="secondary">Invite</Button>
				</div>
				<div className="grid gap-3">
					{teammates.map((member) => (
						<div key={member.name} className="flex items-center gap-3">
							<Avatar.Root>
								<Avatar.Fallback>{member.initials}</Avatar.Fallback>
							</Avatar.Root>
							<p className="flex-1 truncate text-sm font-medium">
								{member.name}
							</p>
							<Badge variant={member.role === "Owner" ? "default" : "outline"}>
								{member.role}
							</Badge>
						</div>
					))}
				</div>
			</Card.Content>
			<Card.Footer className="justify-between">
				<Avatar.Group>
					{teammates.map((member) => (
						<Avatar.Root key={member.initials}>
							<Avatar.Fallback>{member.initials}</Avatar.Fallback>
						</Avatar.Root>
					))}
					<Avatar.GroupCount>+5</Avatar.GroupCount>
				</Avatar.Group>
				<Button variant="ghost" size="sm">
					Manage roles
				</Button>
			</Card.Footer>
		</Card.Root>
	);
}

/** The raw primitives, so the grid also reads as a component inventory. */
function PrimitivesCard() {
	const [agreed, setAgreed] = useState(true);
	return (
		<Card.Root>
			<Card.Header>
				<Card.Title>The primitives underneath</Card.Title>
				<Card.Description>
					Every card on this row is built from these.
				</Card.Description>
			</Card.Header>
			<Card.Content className="grid gap-5">
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
			</Card.Content>
		</Card.Root>
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
