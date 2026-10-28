import { ToggleGroup } from "@voila.dev/ui/toggle-group";

export function Default() {
	return (
		<div className="flex flex-col gap-4">
			<ToggleGroup.Root defaultValue={["week"]} variant="outline">
				<ToggleGroup.Item value="day">Day</ToggleGroup.Item>
				<ToggleGroup.Item value="week">Week</ToggleGroup.Item>
				<ToggleGroup.Item value="month">Month</ToggleGroup.Item>
			</ToggleGroup.Root>
			<ToggleGroup.Root
				multiple
				defaultValue={["designer", "writer"]}
				variant="outline"
			>
				<ToggleGroup.Item value="designer">Designer</ToggleGroup.Item>
				<ToggleGroup.Item value="developer">Developer</ToggleGroup.Item>
				<ToggleGroup.Item value="writer">Copywriter</ToggleGroup.Item>
			</ToggleGroup.Root>
		</div>
	);
}
