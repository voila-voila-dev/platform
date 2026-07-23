import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@voila.dev/ui/components/resizable";

const meta = {
	title: "UI/Resizable",
	component: ResizablePanelGroup,
	tags: ["autodocs"],
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		// The group fills its parent (inline height: 100%), so the size lives on
		// the wrapper, never on ResizablePanelGroup itself.
		<div className="h-48 max-w-xl">
			<ResizablePanelGroup className="rounded-lg border">
				<ResizablePanel defaultSize={50}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="text-sm font-medium">Mission list</span>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={50}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="text-sm font-medium">Mission details</span>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	),
};

export const Vertical: Story = {
	render: () => (
		<div className="h-64 max-w-xl">
			<ResizablePanelGroup orientation="vertical" className="rounded-lg border">
				<ResizablePanel defaultSize={60}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="text-sm font-medium">Provider directory</span>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={40}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="text-sm font-medium">Conversation</span>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	),
};

export const WithoutHandle: Story = {
	render: () => (
		<div className="h-48 max-w-xl">
			<ResizablePanelGroup className="rounded-lg border">
				<ResizablePanel defaultSize={40}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="text-sm font-medium">Filters</span>
					</div>
				</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel defaultSize={60}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="text-sm font-medium">Results</span>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	),
};

export const Collapsible: Story = {
	render: () => (
		<div className="h-48 max-w-xl">
			<ResizablePanelGroup className="rounded-lg border">
				<ResizablePanel
					collapsible
					collapsedSize={0}
					defaultSize={30}
					minSize={15}
				>
					<div className="flex h-full items-center justify-center p-6">
						<span className="text-sm font-medium">Sidebar</span>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={70}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="text-sm font-medium">
							Drag the handle to the edge to collapse
						</span>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	),
};

export const ThreePanel: Story = {
	render: () => (
		<div className="h-48 max-w-2xl">
			<ResizablePanelGroup className="rounded-lg border">
				<ResizablePanel defaultSize={25}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="text-sm font-medium">Navigation</span>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={50}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="text-sm font-medium">Mission list</span>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={25}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="text-sm font-medium">Details</span>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	),
};
