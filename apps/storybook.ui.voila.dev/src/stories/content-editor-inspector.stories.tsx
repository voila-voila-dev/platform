import { SlidersHorizontalIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/button";
import {
	ContentEditor,
	type ContentValue,
	createContentFeatures,
	useInspectedElement,
} from "@voila.dev/ui/content-editor";
import { Sheet } from "@voila.dev/ui/sheet";
import { useState } from "react";
import { fakeUploadImage } from "./content-editor-fixtures.ts";
import {
	inspectorContent,
	planFeature,
} from "./content-editor-inspector-fixtures.tsx";

const FEATURES = [...createContentFeatures(), planFeature];

const meta = {
	title: "ContentEditor/Inspector",
	component: ContentEditor.Inspector,
	parameters: { layout: "padded" },
} satisfies Meta<typeof ContentEditor.Inspector>;

export default meta;

type Story = StoryObj<typeof meta>;

function Editor({ children }: { readonly children: React.ReactNode }) {
	const [value, setValue] = useState<ContentValue | null>(inspectorContent);
	return (
		<ContentEditor.Root
			features={FEATURES}
			value={value}
			onChange={setValue}
			onUploadImage={fakeUploadImage}
			labels={{ items: { plan: "Plan" } }}
		>
			{children}
		</ContentEditor.Root>
	);
}

/** Beside the canvas on a wide screen. Every field type is on the plan card. */
export const SidePanel: Story = {
	render: () => (
		<Editor>
			<div className="grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_20rem]">
				<ContentEditor.Layout>
					<ContentEditor.Toolbar />
					<ContentEditor.Canvas />
				</ContentEditor.Layout>
				<ContentEditor.Inspector className="rounded-lg border border-border p-4 md:sticky md:top-4" />
			</div>
			<ContentEditor.FloatingToolbar />
		</Editor>
	),
};

function SheetInspector() {
	const inspected = useInspectedElement();
	const [open, setOpen] = useState(false);
	return (
		<Sheet.Root open={open && inspected !== null} onOpenChange={setOpen}>
			<Button
				variant="outline"
				size="sm"
				disabled={inspected === null}
				onClick={() => setOpen(true)}
			>
				<SlidersHorizontalIcon aria-hidden />
				Settings
			</Button>
			<Sheet.Content
				side="bottom"
				className="max-h-[80dvh] overflow-y-auto p-4"
			>
				<Sheet.Title className="sr-only">Settings</Sheet.Title>
				<ContentEditor.Inspector />
			</Sheet.Content>
		</Sheet.Root>
	);
}

SheetInspector.slot = "toolbar" as const;

/** On a phone: a sheet the host opens while something with fields is selected. */
export const Sheet_: Story = {
	name: "Sheet",
	parameters: { viewport: { defaultViewport: "mobile1" } },
	render: () => (
		<Editor>
			<ContentEditor.Layout stickyToolbar>
				<ContentEditor.Toolbar />
				<SheetInspector />
				<ContentEditor.Canvas />
			</ContentEditor.Layout>
		</Editor>
	),
};
