import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Resizable } from "@voila.dev/ui/resizable";

const meta = {
	title: "UI/Resizable",
	component: Resizable.PanelGroup,
	tags: ["autodocs"],
} satisfies Meta<typeof Resizable.PanelGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		// The group fills its parent (inline height: 100%), so the size lives on
		// the wrapper, never on Resizable.PanelGroup itself.
		<div className="h-48 max-w-xl">
			<Resizable.PanelGroup className="rounded-lg border">
				<Resizable.Panel defaultSize={50}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="text-sm font-medium">Project list</span>
					</div>
				</Resizable.Panel>
				<Resizable.Handle withHandle />
				<Resizable.Panel defaultSize={50}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="text-sm font-medium">Project details</span>
					</div>
				</Resizable.Panel>
			</Resizable.PanelGroup>
		</div>
	),
};

export const Vertical: Story = {
	render: () => (
		<div className="h-64 max-w-xl">
			<Resizable.PanelGroup
				orientation="vertical"
				className="rounded-lg border"
			>
				<Resizable.Panel defaultSize={60}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="text-sm font-medium">Freelancer directory</span>
					</div>
				</Resizable.Panel>
				<Resizable.Handle withHandle />
				<Resizable.Panel defaultSize={40}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="text-sm font-medium">Conversation</span>
					</div>
				</Resizable.Panel>
			</Resizable.PanelGroup>
		</div>
	),
};

export const WithoutHandle: Story = {
	render: () => (
		<div className="h-48 max-w-xl">
			<Resizable.PanelGroup className="rounded-lg border">
				<Resizable.Panel defaultSize={40}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="text-sm font-medium">Filters</span>
					</div>
				</Resizable.Panel>
				<Resizable.Handle />
				<Resizable.Panel defaultSize={60}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="text-sm font-medium">Results</span>
					</div>
				</Resizable.Panel>
			</Resizable.PanelGroup>
		</div>
	),
};

export const Collapsible: Story = {
	render: () => (
		<div className="h-48 max-w-xl">
			<Resizable.PanelGroup className="rounded-lg border">
				<Resizable.Panel
					collapsible
					collapsedSize={0}
					defaultSize={30}
					minSize={15}
				>
					<div className="flex h-full items-center justify-center p-6">
						<span className="text-sm font-medium">Sidebar</span>
					</div>
				</Resizable.Panel>
				<Resizable.Handle withHandle />
				<Resizable.Panel defaultSize={70}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="text-sm font-medium">
							Drag the handle to the edge to collapse
						</span>
					</div>
				</Resizable.Panel>
			</Resizable.PanelGroup>
		</div>
	),
};

export const ThreePanel: Story = {
	render: () => (
		<div className="h-48 max-w-2xl">
			<Resizable.PanelGroup className="rounded-lg border">
				<Resizable.Panel defaultSize={25}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="text-sm font-medium">Navigation</span>
					</div>
				</Resizable.Panel>
				<Resizable.Handle withHandle />
				<Resizable.Panel defaultSize={50}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="text-sm font-medium">Project list</span>
					</div>
				</Resizable.Panel>
				<Resizable.Handle withHandle />
				<Resizable.Panel defaultSize={25}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="text-sm font-medium">Details</span>
					</div>
				</Resizable.Panel>
			</Resizable.PanelGroup>
		</div>
	),
};
