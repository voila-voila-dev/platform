import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@voila.dev/ui/components/accordion";

const meta = {
	title: "UI/Accordion",
	component: Accordion,
	tags: ["autodocs"],
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Accordion className="w-96" defaultValue={["publishing"]}>
			<AccordionItem value="publishing">
				<AccordionTrigger>How do I publish a mission?</AccordionTrigger>
				<AccordionContent>
					<p>
						From your club dashboard, create a mission with the date, location
						and required specialty. Providers in your area are notified as soon
						as it is published.
					</p>
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="applications">
				<AccordionTrigger>Who can apply to a mission?</AccordionTrigger>
				<AccordionContent>
					<p>
						Any verified health professional whose specialty matches the mission
						requirements can apply. You review applications and pick the best
						fit.
					</p>
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="payment">
				<AccordionTrigger>When is the provider paid?</AccordionTrigger>
				<AccordionContent>
					<p>
						Payment is held when you accept an application and released to the
						provider once the mission report is submitted.
					</p>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	),
};

export const Multiple: Story = {
	render: () => (
		<Accordion
			className="w-96"
			multiple
			defaultValue={["profile", "availability"]}
		>
			<AccordionItem value="profile">
				<AccordionTrigger>Complete your profile</AccordionTrigger>
				<AccordionContent>
					<p>Add your diplomas and specialties to start receiving missions.</p>
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="availability">
				<AccordionTrigger>Set your availability</AccordionTrigger>
				<AccordionContent>
					<p>Tell clubs which weekends you are available for match coverage.</p>
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="bank">
				<AccordionTrigger>Connect your bank account</AccordionTrigger>
				<AccordionContent>
					<p>Connect a bank account to withdraw your mission earnings.</p>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	),
};

export const Disabled: Story = {
	render: () => (
		<Accordion className="w-96">
			<AccordionItem value="profile">
				<AccordionTrigger>Complete your profile</AccordionTrigger>
				<AccordionContent>
					<p>Add your diplomas and specialties to start receiving missions.</p>
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="bank" disabled>
				<AccordionTrigger>Connect your bank account</AccordionTrigger>
				<AccordionContent>
					<p>Connect a bank account to withdraw your mission earnings.</p>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	),
};

export const LongContent: Story = {
	render: () => (
		<Accordion className="w-96">
			<AccordionItem value="how-it-works">
				<AccordionTrigger>How does Acme work?</AccordionTrigger>
				<AccordionContent>
					<p>
						Acme connects sports clubs with verified health professionals for
						match and event coverage. Clubs publish missions describing the
						date, location and required specialty, and providers in the area are
						notified immediately.
					</p>
					<p>
						Providers apply with their profile, diplomas and availability. The
						club reviews each application and accepts the best fit. Once an
						application is accepted, the payment is held in escrow so both sides
						are protected.
					</p>
					<p>
						After the mission, the provider submits a mission report. The
						payment is then released to the provider, who can withdraw their
						earnings to a connected bank account at any time. If something goes
						wrong, either party can open a dispute before the funds are
						released.
					</p>
					<p>
						Read more in the <a href="https://acme.dev">documentation</a>.
					</p>
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="pricing">
				<AccordionTrigger>What does it cost?</AccordionTrigger>
				<AccordionContent>
					<p>
						Publishing a mission is free. A service fee is added when a provider
						is booked.
					</p>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	),
};
