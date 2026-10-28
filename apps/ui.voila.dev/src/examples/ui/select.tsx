import { Select } from "@voila.dev/ui/select";

export function Default() {
	return (
		<Select.Root>
			<Select.Trigger className="w-56">
				<Select.Value placeholder="Select a role" />
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Creative</Select.Label>
					<Select.Item value="designer">Designer</Select.Item>
					<Select.Item value="writer">Copywriter</Select.Item>
				</Select.Group>
				<Select.Group>
					<Select.Label>Technical</Select.Label>
					<Select.Item value="developer">Developer</Select.Item>
					<Select.Item value="data-analyst">Data analyst</Select.Item>
				</Select.Group>
			</Select.Content>
		</Select.Root>
	);
}
