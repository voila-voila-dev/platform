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
				<AccordionTrigger>How do I publish a project?</AccordionTrigger>
				<AccordionContent>
					<p>
						From your client dashboard, create a project with the deadline,
						budget and required skills. Freelancers with matching skills are
						notified as soon as it is published.
					</p>
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="applications">
				<AccordionTrigger>Who can apply to a project?</AccordionTrigger>
				<AccordionContent>
					<p>
						Any verified freelancer whose skills match the project requirements
						can apply. You review applications and pick the best fit.
					</p>
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="payment">
				<AccordionTrigger>When is the freelancer paid?</AccordionTrigger>
				<AccordionContent>
					<p>
						Payment is held when you accept an application and released to the
						freelancer once the deliverables are submitted.
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
					<p>Add your portfolio and skills to start receiving projects.</p>
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="availability">
				<AccordionTrigger>Set your availability</AccordionTrigger>
				<AccordionContent>
					<p>Tell clients which weeks you are available for new engagements.</p>
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="bank">
				<AccordionTrigger>Connect your bank account</AccordionTrigger>
				<AccordionContent>
					<p>Connect a bank account to withdraw your project earnings.</p>
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
					<p>Add your portfolio and skills to start receiving projects.</p>
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="bank" disabled>
				<AccordionTrigger>Connect your bank account</AccordionTrigger>
				<AccordionContent>
					<p>Connect a bank account to withdraw your project earnings.</p>
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
						Acme connects clients with verified independent freelancers for
						design, development and consulting work. Clients publish projects
						describing the deadline, budget and required skills, and matching
						freelancers are notified immediately.
					</p>
					<p>
						Freelancers apply with their profile, portfolio and availability.
						The client reviews each application and accepts the best fit. Once
						an application is accepted, the payment is held in escrow so both
						sides are protected.
					</p>
					<p>
						After the project, the freelancer submits the deliverables. The
						payment is then released to the freelancer, who can withdraw their
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
						Publishing a project is free. A service fee is added when a
						freelancer is booked.
					</p>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	),
};
