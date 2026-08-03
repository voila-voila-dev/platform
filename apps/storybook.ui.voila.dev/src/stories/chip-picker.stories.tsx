import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	ChipPicker,
	type ChipPickerLabels,
	type ChipPickerOption,
} from "@voila.dev/ui/chip-picker";
import { useState } from "react";

const labels: ChipPickerLabels = {
	select: "Select",
	done: "Done",
	noResult: "No result.",
	selectionCount: (count) => `${count} selected`,
};

const interests: ReadonlyArray<ChipPickerOption> = [
	{ id: "trail-running", label: "Trail running" },
	{ id: "cooking", label: "Cooking" },
	{ id: "boxing", label: "Boxing" },
	{ id: "singing", label: "Singing" },
	{ id: "cinema", label: "Cinema" },
	{ id: "climbing", label: "Climbing" },
	{ id: "photography", label: "Photography" },
	{ id: "chess", label: "Chess" },
	{ id: "piano", label: "Piano" },
	{ id: "volunteering", label: "Volunteering" },
	{ id: "wine-tasting", label: "Wine tasting" },
	{ id: "yoga", label: "Yoga" },
];

const meta = {
	title: "UI/ChipPicker",
	component: ChipPicker,
	tags: ["autodocs"],
	argTypes: {
		maxSelected: { control: "number" },
	},
	// The component is controlled; stories wrap it in local state, so the meta
	// args only satisfy the required-props contract for autodocs.
	args: {
		title: "Your interests",
		searchPlaceholder: "Search for an interest…",
		labels,
		options: interests,
		selected: new Set<string>(),
		onToggle: () => {},
	},
} satisfies Meta<typeof ChipPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

function ControlledChipPicker({
	initialSelected,
	maxSelected,
}: {
	initialSelected?: ReadonlyArray<string>;
	maxSelected?: number;
}) {
	const [selected, setSelected] = useState(
		() => new Set<string>(initialSelected ?? []),
	);
	return (
		<div className="max-w-md">
			<ChipPicker
				title="Your interests"
				searchPlaceholder="Search for an interest…"
				labels={labels}
				options={interests}
				selected={selected}
				onToggle={(id) =>
					setSelected((current) => {
						const next = new Set(current);
						if (next.has(id)) next.delete(id);
						else next.add(id);
						return next;
					})
				}
				maxSelected={maxSelected}
			/>
		</div>
	);
}

export const Default: Story = {
	render: () => (
		<ControlledChipPicker initialSelected={["trail-running", "cooking"]} />
	),
};

export const Empty: Story = {
	render: () => <ControlledChipPicker />,
};

export const CappedSelection: Story = {
	render: () => (
		<ControlledChipPicker
			initialSelected={["trail-running", "cooking"]}
			maxSelected={3}
		/>
	),
};
