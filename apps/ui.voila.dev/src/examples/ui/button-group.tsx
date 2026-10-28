import { CalendarIcon } from "@phosphor-icons/react";
import { Button } from "@voila.dev/ui/button";
import { ButtonGroup } from "@voila.dev/ui/button-group";

export function Default() {
	return (
		<div className="flex flex-col gap-4">
			<ButtonGroup.Root>
				<Button variant="outline">Day</Button>
				<Button variant="outline">Week</Button>
				<Button variant="outline">Month</Button>
			</ButtonGroup.Root>
			<ButtonGroup.Root>
				<ButtonGroup.Text>
					<CalendarIcon />
				</ButtonGroup.Text>
				<ButtonGroup.Separator />
				<Button variant="outline">This week</Button>
			</ButtonGroup.Root>
		</div>
	);
}
