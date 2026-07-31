import { CalendarIcon, GearIcon, UserIcon } from "@phosphor-icons/react";
import { Command } from "@voila.dev/ui/command";

export function Default() {
	return (
		<div className="w-full max-w-80 rounded-xl border">
			<Command.Root>
				<Command.Input placeholder="Search projects, freelancers…" />
				<Command.List>
					<Command.Empty>No results found.</Command.Empty>
					<Command.Group heading="Projects">
						<Command.Item>
							<CalendarIcon />
							Launch support — Saturday
						</Command.Item>
						<Command.Item>
							<CalendarIcon />
							Design review — Tuesday
						</Command.Item>
					</Command.Group>
					<Command.Separator />
					<Command.Group heading="Freelancers">
						<Command.Item>
							<UserIcon />
							Nathan Guyot
							<Command.Shortcut>⌘P</Command.Shortcut>
						</Command.Item>
					</Command.Group>
					<Command.Separator />
					<Command.Group heading="Settings">
						<Command.Item>
							<GearIcon />
							Workspace settings
							<Command.Shortcut>⌘S</Command.Shortcut>
						</Command.Item>
					</Command.Group>
				</Command.List>
			</Command.Root>
		</div>
	);
}
