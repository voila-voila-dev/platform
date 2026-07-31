import { Accordion } from "@voila.dev/ui/accordion";

export function Default() {
	return (
		<Accordion.Root className="w-full max-w-96" defaultValue={["publishing"]}>
			<Accordion.Item value="publishing">
				<Accordion.Trigger>How do I publish a project?</Accordion.Trigger>
				<Accordion.Content>
					<p>
						From your workspace dashboard, create a project with the scope,
						timeline and required role. Matching freelancers are notified as
						soon as it is published.
					</p>
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="applications">
				<Accordion.Trigger>Who can apply to a project?</Accordion.Trigger>
				<Accordion.Content>
					<p>
						Any verified freelancer whose skills match the project requirements
						can apply.
					</p>
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="payment">
				<Accordion.Trigger>When is the freelancer paid?</Accordion.Trigger>
				<Accordion.Content>
					<p>
						Payment is held when you accept a proposal and released once the
						project report is submitted.
					</p>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	);
}
