import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Icon } from "@voila.dev/ui-icon/components/icon";

const meta = {
	title: "UI/Icon",
	component: Icon,
	tags: ["autodocs"],
	args: {
		name: "HeartbeatIcon",
		size: 24,
	},
	argTypes: {
		name: { control: "text" },
		weight: {
			control: "select",
			options: ["thin", "light", "regular", "bold", "fill", "duotone"],
		},
	},
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HealthcareSet: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			{[
				"HeartbeatIcon",
				"FirstAidKitIcon",
				"StethoscopeIcon",
				"BandaidsIcon",
				"PersonSimpleRunIcon",
				"CalendarCheckIcon",
			].map((name) => (
				<div key={name} className="flex min-w-24 flex-col items-center gap-1">
					<Icon name={name} size={28} />
					<span className="text-xs text-muted-foreground">
						{name.replace(/Icon$/, "")}
					</span>
				</div>
			))}
		</div>
	),
};

const weightOptions = [
	"thin",
	"light",
	"regular",
	"bold",
	"fill",
	"duotone",
] as const;

export const Weights: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			{weightOptions.map((weight) => (
				<div key={weight} className="flex min-w-14 flex-col items-center gap-1">
					<Icon name="HeartbeatIcon" size={28} weight={weight} />
					<span className="text-xs text-muted-foreground">{weight}</span>
				</div>
			))}
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-end gap-4">
			{[16, 24, 32, 48].map((size) => (
				<div key={size} className="flex min-w-14 flex-col items-center gap-1">
					<Icon name="HeartbeatIcon" size={size} />
					<span className="text-xs text-muted-foreground">{size}px</span>
				</div>
			))}
		</div>
	),
};

export const Colors: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<div className="flex min-w-24 flex-col items-center gap-1">
				<Icon name="HeartbeatIcon" size={28} className="text-primary" />
				<span className="text-xs text-muted-foreground">className</span>
			</div>
			<div className="flex min-w-24 flex-col items-center gap-1">
				<Icon name="HeartbeatIcon" size={28} color="var(--color-destructive)" />
				<span className="text-xs text-muted-foreground">color prop</span>
			</div>
			<div className="flex min-w-24 flex-col items-center gap-1">
				<Icon
					name="FirstAidKitIcon"
					size={28}
					weight="duotone"
					className="text-primary"
				/>
				<span className="text-xs text-muted-foreground">duotone</span>
			</div>
		</div>
	),
};

export const UnknownNameFallsBack: Story = {
	args: {
		name: "NotARealIconName",
	},
};
