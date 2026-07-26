import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Accordion } from "@voila.dev/ui/accordion";

const meta = {
	title: "UI/Accordion",
	component: Accordion.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof Accordion.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Accordion.Root className="w-96" defaultValue={["publishing"]}>
			<Accordion.Item value="publishing">
				<Accordion.Trigger>How do I publish a project?</Accordion.Trigger>
				<Accordion.Content>
					<p>
						From your client dashboard, create a project with the deadline,
						budget and required skills. Freelancers with matching skills are
						notified as soon as it is published.
					</p>
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="applications">
				<Accordion.Trigger>Who can apply to a project?</Accordion.Trigger>
				<Accordion.Content>
					<p>
						Any verified freelancer whose skills match the project requirements
						can apply. You review applications and pick the best fit.
					</p>
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="payment">
				<Accordion.Trigger>When is the freelancer paid?</Accordion.Trigger>
				<Accordion.Content>
					<p>
						Payment is held when you accept an application and released to the
						freelancer once the deliverables are submitted.
					</p>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	),
};

export const Multiple: Story = {
	render: () => (
		<Accordion.Root
			className="w-96"
			multiple
			defaultValue={["profile", "availability"]}
		>
			<Accordion.Item value="profile">
				<Accordion.Trigger>Complete your profile</Accordion.Trigger>
				<Accordion.Content>
					<p>Add your portfolio and skills to start receiving projects.</p>
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="availability">
				<Accordion.Trigger>Set your availability</Accordion.Trigger>
				<Accordion.Content>
					<p>Tell clients which weeks you are available for new engagements.</p>
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="bank">
				<Accordion.Trigger>Connect your bank account</Accordion.Trigger>
				<Accordion.Content>
					<p>Connect a bank account to withdraw your project earnings.</p>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	),
};

export const Disabled: Story = {
	render: () => (
		<Accordion.Root className="w-96">
			<Accordion.Item value="profile">
				<Accordion.Trigger>Complete your profile</Accordion.Trigger>
				<Accordion.Content>
					<p>Add your portfolio and skills to start receiving projects.</p>
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="bank" disabled>
				<Accordion.Trigger>Connect your bank account</Accordion.Trigger>
				<Accordion.Content>
					<p>Connect a bank account to withdraw your project earnings.</p>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	),
};

export const LongContent: Story = {
	render: () => (
		<Accordion.Root className="w-96">
			<Accordion.Item value="how-it-works">
				<Accordion.Trigger>How does Acme work?</Accordion.Trigger>
				<Accordion.Content>
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
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="pricing">
				<Accordion.Trigger>What does it cost?</Accordion.Trigger>
				<Accordion.Content>
					<p>
						Publishing a project is free. A service fee is added when a
						freelancer is booked.
					</p>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	),
};
