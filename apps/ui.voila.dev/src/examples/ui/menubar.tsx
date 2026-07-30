import { Menubar } from "@voila.dev/ui/menubar";

export function MenubarExample() {
	return (
		<Menubar.Root>
			<Menubar.Menu>
				<Menubar.Trigger>Projects</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Item>
						New project <Menubar.Shortcut>⌘N</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Item>Duplicate project</Menubar.Item>
					<Menubar.Separator />
					<Menubar.Sub>
						<Menubar.SubTrigger>Export</Menubar.SubTrigger>
						<Menubar.SubContent>
							<Menubar.Item>Export as CSV</Menubar.Item>
							<Menubar.Item>Export as PDF</Menubar.Item>
						</Menubar.SubContent>
					</Menubar.Sub>
					<Menubar.Separator />
					<Menubar.Item variant="destructive">Cancel project</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>
			<Menubar.Menu>
				<Menubar.Trigger>View</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.CheckboxItem defaultChecked>
						Show archived projects
					</Menubar.CheckboxItem>
					<Menubar.Separator />
					<Menubar.RadioGroup defaultValue="week">
						<Menubar.RadioItem value="day">Day</Menubar.RadioItem>
						<Menubar.RadioItem value="week">Week</Menubar.RadioItem>
						<Menubar.RadioItem value="month">Month</Menubar.RadioItem>
					</Menubar.RadioGroup>
				</Menubar.Content>
			</Menubar.Menu>
		</Menubar.Root>
	);
}
