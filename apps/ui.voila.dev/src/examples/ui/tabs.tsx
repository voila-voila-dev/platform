import { Tabs } from "@voila.dev/ui/tabs";

export function Default() {
	return (
		<Tabs.Root defaultValue="projects" className="w-full max-w-96">
			<Tabs.List>
				<Tabs.Trigger value="projects">Projects</Tabs.Trigger>
				<Tabs.Trigger value="freelancers">Freelancers</Tabs.Trigger>
				<Tabs.Trigger value="billing">Billing</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="projects">
				Review upcoming projects and their staffing status.
			</Tabs.Content>
			<Tabs.Content value="freelancers">
				Browse independent freelancers available for hire.
			</Tabs.Content>
			<Tabs.Content value="billing">
				Track invoices and payouts for completed projects.
			</Tabs.Content>
		</Tabs.Root>
	);
}

export function Line() {
	return (
		<Tabs.Root defaultValue="projects" className="w-full max-w-96">
			<Tabs.List variant="line">
				<Tabs.Trigger value="projects">Projects</Tabs.Trigger>
				<Tabs.Trigger value="freelancers">Freelancers</Tabs.Trigger>
				<Tabs.Trigger value="billing">Billing</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="projects">
				Review upcoming projects and their staffing status.
			</Tabs.Content>
			<Tabs.Content value="freelancers">
				Browse independent freelancers available for hire.
			</Tabs.Content>
			<Tabs.Content value="billing">
				Track invoices and payouts for completed projects.
			</Tabs.Content>
		</Tabs.Root>
	);
}
