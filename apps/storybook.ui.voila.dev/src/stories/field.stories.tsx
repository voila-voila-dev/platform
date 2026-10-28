import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Checkbox } from "@voila.dev/ui/checkbox";
import { Field } from "@voila.dev/ui/field";
import { Input } from "@voila.dev/ui/input";
import { Textarea } from "@voila.dev/ui/textarea";

const meta = {
	title: "UI/Field",
	component: Field.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof Field.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="w-96">
			<Field.Group>
				<Field.Root>
					<Field.Label htmlFor="workspace-name">Workspace name</Field.Label>
					<Input id="workspace-name" placeholder="Northwind Studio" />
					<Field.Description>
						Shown to freelancers on every project you publish.
					</Field.Description>
				</Field.Root>
				<Field.Root>
					<Field.Label htmlFor="contact-email">Contact email</Field.Label>
					<Input
						id="contact-email"
						type="email"
						placeholder="team@example.com"
					/>
				</Field.Root>
				<Field.Separator>Optional</Field.Separator>
				<Field.Root>
					<Field.Label htmlFor="project-notes">Project notes</Field.Label>
					<Textarea
						id="project-notes"
						placeholder="Goals, scope, links to briefs..."
					/>
				</Field.Root>
			</Field.Group>
		</div>
	),
};

export const WithError: Story = {
	render: () => (
		<div className="w-96">
			<Field.Root invalid>
				<Field.Label htmlFor="tax-id">Tax ID</Field.Label>
				<Input
					id="tax-id"
					aria-invalid
					aria-describedby="tax-id-error"
					defaultValue="123"
				/>
				<Field.Error
					id="tax-id-error"
					errors={[{ message: "Tax ID must be 11 digits." }]}
				/>
			</Field.Root>
		</div>
	),
};

export const WithMultipleErrors: Story = {
	render: () => (
		<div className="w-96">
			<Field.Root invalid>
				<Field.Label htmlFor="new-password">New password</Field.Label>
				<Input
					id="new-password"
					type="password"
					aria-invalid
					aria-describedby="new-password-error"
					defaultValue="abc"
				/>
				<Field.Error
					id="new-password-error"
					errors={[
						{ message: "Password must be at least 12 characters." },
						{ message: "Password must contain a number." },
						{ message: "Password must contain a number." },
					]}
				/>
			</Field.Root>
		</div>
	),
};

export const WithFieldSet: Story = {
	render: () => (
		<div className="w-96">
			<Field.Set>
				<Field.Legend>Availability</Field.Legend>
				<Field.Description>
					Tell clients when you are available for projects.
				</Field.Description>
				<Field.Group>
					<Field.Root orientation="horizontal">
						<Field.Label htmlFor="available-from">From</Field.Label>
						<Input id="available-from" type="date" />
					</Field.Root>
					<Field.Root orientation="horizontal">
						<Field.Label htmlFor="available-until">Until</Field.Label>
						<Input id="available-until" type="date" />
					</Field.Root>
				</Field.Group>
			</Field.Set>
		</div>
	),
};

export const ResponsiveOrientation: Story = {
	render: () => (
		<div className="w-full max-w-2xl resize-x overflow-auto rounded-lg border border-dashed p-4">
			<Field.Group>
				<Field.Root orientation="responsive">
					<Field.Label htmlFor="responsive-name">Full name</Field.Label>
					<Input id="responsive-name" placeholder="Nathan Guyot" />
				</Field.Root>
				<Field.Root orientation="responsive">
					<Field.Label htmlFor="responsive-city">City</Field.Label>
					<Input id="responsive-city" placeholder="Rotterdam" />
				</Field.Root>
			</Field.Group>
		</div>
	),
};

export const CheckboxCard: Story = {
	render: () => (
		<div className="w-96">
			<Field.Set>
				<Field.Legend variant="label">Notifications</Field.Legend>
				<Field.Group data-slot="checkbox-group">
					<Field.Label htmlFor="notify-projects">
						<Field.Root orientation="horizontal">
							<Checkbox id="notify-projects" defaultChecked />
							<Field.Content>
								<Field.Title>New projects</Field.Title>
								<Field.Description>
									Get notified when a client publishes a project matching your
									skills.
								</Field.Description>
							</Field.Content>
						</Field.Root>
					</Field.Label>
					<Field.Label htmlFor="notify-reports">
						<Field.Root orientation="horizontal">
							<Checkbox id="notify-reports" />
							<Field.Content>
								<Field.Title>Project reports</Field.Title>
								<Field.Description>
									Get notified when a deliverable is ready for review.
								</Field.Description>
							</Field.Content>
						</Field.Root>
					</Field.Label>
				</Field.Group>
			</Field.Set>
		</div>
	),
};

export const Disabled: Story = {
	render: () => (
		<div className="w-96">
			<Field.Root data-disabled="true">
				<Field.Label htmlFor="disabled-business-id">Business ID</Field.Label>
				<Input
					id="disabled-business-id"
					disabled
					defaultValue="123 456 789 00012"
				/>
				<Field.Description>
					Verified automatically — contact support to change it.
				</Field.Description>
			</Field.Root>
		</div>
	),
};
