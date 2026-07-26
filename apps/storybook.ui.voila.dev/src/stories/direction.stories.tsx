import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/button";
import { DirectionProvider } from "@voila.dev/ui/direction";
import { DropdownMenu } from "@voila.dev/ui/dropdown-menu";

const meta = {
	title: "UI/Direction",
	component: DirectionProvider,
	tags: ["autodocs"],
	argTypes: {
		direction: {
			control: "inline-radio",
			options: ["ltr", "rtl"],
			description:
				"Reading direction used by Base UI for logical positioning and keyboard navigation.",
		},
	},
	parameters: {
		docs: {
			description: {
				component:
					'`DirectionProvider` informs Base UI\'s logical positioning and keyboard navigation only. It does not set the `dir` attribute on the DOM: text alignment, visual ordering, and portaled popups (rendered under `document.body`) still follow the closest DOM `dir` ancestor. When localizing to a right-to-left language, set `dir="rtl"` on `<html>` alongside the provider.',
			},
		},
	},
} satisfies Meta<typeof DirectionProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		direction: "rtl",
	},
	parameters: {
		docs: {
			description: {
				story:
					"The popup content is portaled to `document.body`, so it does not inherit `dir` from the container — in a real app set `dir` on `<html>`; here the story sets it on the popup explicitly to keep the demo self-contained.",
			},
		},
	},
	render: (args) => (
		<DirectionProvider direction={args.direction}>
			<div
				dir={args.direction}
				className="flex w-80 flex-col gap-3 rounded-xl border p-4 text-sm"
			>
				<p className="font-medium">Right-to-left layout</p>
				<p className="text-muted-foreground">
					Components wrapped in the provider position their popups and align
					their content for right-to-left languages.
				</p>
				<div>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger render={<Button variant="outline" />}>
							Project actions
						</DropdownMenu.Trigger>
						<DropdownMenu.Content dir={args.direction}>
							<DropdownMenu.Item>Edit project</DropdownMenu.Item>
							<DropdownMenu.Item>Duplicate</DropdownMenu.Item>
							<DropdownMenu.Item variant="destructive">
								Cancel
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</div>
		</DirectionProvider>
	),
};

export const SubmenuPositioning: Story = {
	parameters: {
		docs: {
			description: {
				story:
					"The observable effect of the provider: submenus anchor to the logical inline-end side, so the same submenu opens to the right in LTR and to the left in RTL.",
			},
		},
	},
	render: () => (
		<div className="flex flex-wrap gap-6">
			{(["ltr", "rtl"] as const).map((direction) => (
				<DirectionProvider key={direction} direction={direction}>
					<div
						dir={direction}
						className="flex w-64 flex-col gap-2 rounded-xl border p-4"
					>
						<p className="text-sm font-medium">
							{direction === "ltr" ? "Left to right" : "Right to left"}
						</p>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger
								render={<Button variant="outline" className="self-start" />}
							>
								Project actions
							</DropdownMenu.Trigger>
							<DropdownMenu.Content dir={direction}>
								<DropdownMenu.Item>Edit project</DropdownMenu.Item>
								<DropdownMenu.Sub>
									<DropdownMenu.SubTrigger>Assign to</DropdownMenu.SubTrigger>
									<DropdownMenu.SubContent dir={direction}>
										<DropdownMenu.Item>Nathan Guyot</DropdownMenu.Item>
										<DropdownMenu.Item>Marie Dupont</DropdownMenu.Item>
									</DropdownMenu.SubContent>
								</DropdownMenu.Sub>
								<DropdownMenu.Item variant="destructive">
									Cancel
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
				</DirectionProvider>
			))}
		</div>
	),
};

export const SideBySide: Story = {
	render: () => (
		<div className="flex flex-wrap gap-6">
			<DirectionProvider direction="ltr">
				<div
					dir="ltr"
					className="flex w-64 flex-col gap-2 rounded-xl border p-4"
				>
					<p className="text-sm font-medium">Left to right</p>
					<Button variant="outline" className="self-start">
						Book a freelancer
					</Button>
				</div>
			</DirectionProvider>
			<DirectionProvider direction="rtl">
				<div
					dir="rtl"
					className="flex w-64 flex-col gap-2 rounded-xl border p-4"
				>
					<p className="text-sm font-medium">Right to left</p>
					<Button variant="outline" className="self-start">
						Book a freelancer
					</Button>
				</div>
			</DirectionProvider>
		</div>
	),
};
