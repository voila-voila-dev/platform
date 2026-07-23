import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { ResponsiveSelect } from "@voila.dev/ui/components/responsive-select";
import { useState } from "react";

/**
 * One composable declaration, two surfaces: the Base UI `Select` popup on
 * desktop and the OS-native `<select>` under the 768px breakpoint. Resize the
 * Storybook viewport (or your window) below 768px to see the native picker take
 * over — the same `Root`/`Trigger`/`Content`/`Item` tree drives both.
 */
const meta = {
	title: "UI/ResponsiveSelect",
	component: ResponsiveSelect.Root,
	tags: ["autodocs"],
	parameters: {
		docs: {
			description: {
				component:
					"Resize the viewport below 768px to swap the Base UI popup for the OS-native picker.",
			},
		},
	},
} satisfies Meta<typeof ResponsiveSelect.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const [value, setValue] = useState("physiotherapist");
		return (
			<div className="w-72">
				<ResponsiveSelect.Root value={value} onValueChange={setValue}>
					<ResponsiveSelect.Trigger className="w-full">
						<ResponsiveSelect.Value placeholder="Select a specialty" />
					</ResponsiveSelect.Trigger>
					<ResponsiveSelect.Content>
						<ResponsiveSelect.Item value="physiotherapist">
							Physiotherapist
						</ResponsiveSelect.Item>
						<ResponsiveSelect.Item value="osteopath">
							Osteopath
						</ResponsiveSelect.Item>
						<ResponsiveSelect.Item value="nurse">Nurse</ResponsiveSelect.Item>
						<ResponsiveSelect.Item value="sports-doctor">
							Sports doctor
						</ResponsiveSelect.Item>
					</ResponsiveSelect.Content>
				</ResponsiveSelect.Root>
			</div>
		);
	},
};

export const Placeholder: Story = {
	render: () => {
		const [value, setValue] = useState("");
		return (
			<div className="w-72">
				<ResponsiveSelect.Root value={value} onValueChange={setValue}>
					<ResponsiveSelect.Trigger className="w-full">
						<ResponsiveSelect.Value placeholder="Pick a skill…" />
					</ResponsiveSelect.Trigger>
					<ResponsiveSelect.Content>
						<ResponsiveSelect.Item value="rugby">Rugby</ResponsiveSelect.Item>
						<ResponsiveSelect.Item value="tennis">Tennis</ResponsiveSelect.Item>
					</ResponsiveSelect.Content>
				</ResponsiveSelect.Root>
			</div>
		);
	},
};

export const Grouped: Story = {
	render: () => {
		const [value, setValue] = useState("Europe/Paris");
		return (
			<div className="w-72">
				<ResponsiveSelect.Root value={value} onValueChange={setValue}>
					<ResponsiveSelect.Trigger className="w-full">
						<ResponsiveSelect.Value placeholder="Select a time zone" />
					</ResponsiveSelect.Trigger>
					<ResponsiveSelect.Content>
						<ResponsiveSelect.Group>
							<ResponsiveSelect.Label>Métropole</ResponsiveSelect.Label>
							<ResponsiveSelect.Item value="Europe/Paris">
								Paris
							</ResponsiveSelect.Item>
							<ResponsiveSelect.Item value="Europe/Brussels">
								Brussels
							</ResponsiveSelect.Item>
						</ResponsiveSelect.Group>
						<ResponsiveSelect.Group>
							<ResponsiveSelect.Label>Outre-mer</ResponsiveSelect.Label>
							<ResponsiveSelect.Item value="America/Martinique">
								Martinique
							</ResponsiveSelect.Item>
							<ResponsiveSelect.Item value="Indian/Reunion">
								Réunion
							</ResponsiveSelect.Item>
						</ResponsiveSelect.Group>
					</ResponsiveSelect.Content>
				</ResponsiveSelect.Root>
			</div>
		);
	},
};

export const Invalid: Story = {
	render: () => {
		const [value, setValue] = useState("physiotherapist");
		return (
			<div className="w-72">
				<ResponsiveSelect.Root value={value} onValueChange={setValue}>
					<ResponsiveSelect.Trigger className="w-full" aria-invalid>
						<ResponsiveSelect.Value />
					</ResponsiveSelect.Trigger>
					<ResponsiveSelect.Content>
						<ResponsiveSelect.Item value="physiotherapist">
							Physiotherapist
						</ResponsiveSelect.Item>
						<ResponsiveSelect.Item value="osteopath">
							Osteopath
						</ResponsiveSelect.Item>
					</ResponsiveSelect.Content>
				</ResponsiveSelect.Root>
			</div>
		);
	},
};

export const Disabled: Story = {
	render: () => (
		<div className="w-72">
			<ResponsiveSelect.Root value="physiotherapist" disabled>
				<ResponsiveSelect.Trigger className="w-full">
					<ResponsiveSelect.Value />
				</ResponsiveSelect.Trigger>
				<ResponsiveSelect.Content>
					<ResponsiveSelect.Item value="physiotherapist">
						Physiotherapist
					</ResponsiveSelect.Item>
				</ResponsiveSelect.Content>
			</ResponsiveSelect.Root>
		</div>
	),
};
