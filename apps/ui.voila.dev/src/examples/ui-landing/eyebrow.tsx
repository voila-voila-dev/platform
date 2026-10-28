import { BuildingsIcon } from "@phosphor-icons/react";
import { Eyebrow as EyebrowParts } from "@voila.dev/ui/landing";

export function Eyebrow() {
	return (
		<div className="flex flex-wrap gap-4">
			<EyebrowParts.Root tone="brand">
				<EyebrowParts.Dot pulse />
				<EyebrowParts.Label>New platform</EyebrowParts.Label>
			</EyebrowParts.Root>
			<EyebrowParts.Root tone="highlight">
				<EyebrowParts.Icon>
					<BuildingsIcon />
				</EyebrowParts.Icon>
				<EyebrowParts.Label>For client teams</EyebrowParts.Label>
			</EyebrowParts.Root>
		</div>
	);
}
