import { SegmentedControl } from "@voila.dev/ui/segmented-control";

export function Default() {
	return (
		<div className="flex flex-col items-start gap-4">
			<SegmentedControl.Root defaultValue="week" size="sm">
				<SegmentedControl.Item value="day">Day</SegmentedControl.Item>
				<SegmentedControl.Item value="week">Week</SegmentedControl.Item>
				<SegmentedControl.Item value="month">Month</SegmentedControl.Item>
			</SegmentedControl.Root>
			<SegmentedControl.Root defaultValue="week">
				<SegmentedControl.Item value="day">Day</SegmentedControl.Item>
				<SegmentedControl.Item value="week">Week</SegmentedControl.Item>
				<SegmentedControl.Item value="month">Month</SegmentedControl.Item>
			</SegmentedControl.Root>
		</div>
	);
}
