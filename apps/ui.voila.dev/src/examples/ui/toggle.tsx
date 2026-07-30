import { StarIcon } from "@phosphor-icons/react";
import { Toggle } from "@voila.dev/ui/toggle";

export function ToggleExample() {
	return (
		<>
			<Toggle aria-label="Mark freelancer as favorite">
				<StarIcon
					data-icon="inline-start"
					className="group-data-pressed/toggle:hidden"
				/>
				<StarIcon
					data-icon="inline-start"
					weight="fill"
					className="hidden group-data-pressed/toggle:inline"
				/>
				Favorite
			</Toggle>
			<Toggle variant="outline" defaultPressed>
				Outline
			</Toggle>
		</>
	);
}
