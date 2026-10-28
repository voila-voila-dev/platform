import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { ResponsiveSelect } from "@voila.dev/ui/responsive-select";
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
		const [value, setValue] = useState("designer");
		return (
			<div className="w-72">
				<ResponsiveSelect.Root value={value} onValueChange={setValue}>
					<ResponsiveSelect.Trigger className="w-full">
						<ResponsiveSelect.Value placeholder="Select a role" />
					</ResponsiveSelect.Trigger>
					<ResponsiveSelect.Content>
						<ResponsiveSelect.Item value="designer">
							Designer
						</ResponsiveSelect.Item>
						<ResponsiveSelect.Item value="developer">
							Developer
						</ResponsiveSelect.Item>
						<ResponsiveSelect.Item value="writer">Writer</ResponsiveSelect.Item>
						<ResponsiveSelect.Item value="data-analyst">
							Data analyst
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
						<ResponsiveSelect.Item value="figma">Figma</ResponsiveSelect.Item>
						<ResponsiveSelect.Item value="react">React</ResponsiveSelect.Item>
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
							<ResponsiveSelect.Label>Europe</ResponsiveSelect.Label>
							<ResponsiveSelect.Item value="Europe/Paris">
								Paris
							</ResponsiveSelect.Item>
							<ResponsiveSelect.Item value="Europe/Brussels">
								Brussels
							</ResponsiveSelect.Item>
						</ResponsiveSelect.Group>
						<ResponsiveSelect.Group>
							<ResponsiveSelect.Label>Americas</ResponsiveSelect.Label>
							<ResponsiveSelect.Item value="America/New_York">
								New York
							</ResponsiveSelect.Item>
							<ResponsiveSelect.Item value="America/Sao_Paulo">
								São Paulo
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
		const [value, setValue] = useState("designer");
		return (
			<div className="w-72">
				<ResponsiveSelect.Root value={value} onValueChange={setValue}>
					<ResponsiveSelect.Trigger className="w-full" aria-invalid>
						<ResponsiveSelect.Value />
					</ResponsiveSelect.Trigger>
					<ResponsiveSelect.Content>
						<ResponsiveSelect.Item value="designer">
							Designer
						</ResponsiveSelect.Item>
						<ResponsiveSelect.Item value="developer">
							Developer
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
			<ResponsiveSelect.Root value="designer" disabled>
				<ResponsiveSelect.Trigger className="w-full">
					<ResponsiveSelect.Value />
				</ResponsiveSelect.Trigger>
				<ResponsiveSelect.Content>
					<ResponsiveSelect.Item value="designer">
						Designer
					</ResponsiveSelect.Item>
				</ResponsiveSelect.Content>
			</ResponsiveSelect.Root>
		</div>
	),
};
