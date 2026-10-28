import { CalendarPlusIcon } from "@phosphor-icons/react";
import { Button } from "@voila.dev/ui/button";
import { Empty } from "@voila.dev/ui/empty";

export function EmptyDefault() {
	return (
		<div className="w-full max-w-96">
			<Empty.Root bordered>
				<Empty.Header>
					<Empty.Media variant="icon">
						<CalendarPlusIcon />
					</Empty.Media>
					<Empty.Title>No projects yet</Empty.Title>
					<Empty.Description>
						Create your first project to start receiving proposals from
						independent freelancers.
					</Empty.Description>
				</Empty.Header>
				<Empty.Content>
					<Button>Create a project</Button>
				</Empty.Content>
			</Empty.Root>
		</div>
	);
}
