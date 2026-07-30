import { Chip } from "@voila.dev/ui/chip";

export function ChipExample() {
	return (
		<>
			<Chip.Root variant="secondary">
				Product design
				<Chip.Remove aria-label="Remove Product design" />
			</Chip.Root>
			<Chip.Root variant="outline">Development</Chip.Root>
			<Chip.Root variant="brand" size="sm">
				Remote
				<Chip.Remove aria-label="Remove Remote" />
			</Chip.Root>
		</>
	);
}
