import { Button } from "@voila.dev/ui/button";
import { Tooltip } from "@voila.dev/ui/tooltip";

export function Default() {
	return (
		<>
			{(["top", "right", "bottom", "left"] as const).map((side) => (
				<Tooltip.Root key={side}>
					<Tooltip.Trigger render={<Button variant="outline" />}>
						{side}
					</Tooltip.Trigger>
					<Tooltip.Content side={side}>
						Tooltip on the {side} side
					</Tooltip.Content>
				</Tooltip.Root>
			))}
		</>
	);
}
