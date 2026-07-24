import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Checkbox } from "@voila.dev/ui/components/checkbox";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
	FieldTitle,
} from "@voila.dev/ui/components/field";
import { Input } from "@voila.dev/ui/components/input";
import { Textarea } from "@voila.dev/ui/components/textarea";

const meta = {
	title: "UI/Field",
	component: Field,
	tags: ["autodocs"],
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="w-96">
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel>
					<Input id="workspace-name" placeholder="Northwind Studio" />
					<FieldDescription>
						Shown to freelancers on every project you publish.
					</FieldDescription>
				</Field>
				<Field>
					<FieldLabel htmlFor="contact-email">Contact email</FieldLabel>
					<Input
						id="contact-email"
						type="email"
						placeholder="team@example.com"
					/>
				</Field>
				<FieldSeparator>Optional</FieldSeparator>
				<Field>
					<FieldLabel htmlFor="project-notes">Project notes</FieldLabel>
					<Textarea
						id="project-notes"
						placeholder="Goals, scope, links to briefs..."
					/>
				</Field>
			</FieldGroup>
		</div>
	),
};

export const WithError: Story = {
	render: () => (
		<div className="w-96">
			<Field invalid>
				<FieldLabel htmlFor="tax-id">Tax ID</FieldLabel>
				<Input
					id="tax-id"
					aria-invalid
					aria-describedby="tax-id-error"
					defaultValue="123"
				/>
				<FieldError
					id="tax-id-error"
					errors={[{ message: "Tax ID must be 11 digits." }]}
				/>
			</Field>
		</div>
	),
};

export const WithMultipleErrors: Story = {
	render: () => (
		<div className="w-96">
			<Field invalid>
				<FieldLabel htmlFor="new-password">New password</FieldLabel>
				<Input
					id="new-password"
					type="password"
					aria-invalid
					aria-describedby="new-password-error"
					defaultValue="abc"
				/>
				<FieldError
					id="new-password-error"
					errors={[
						{ message: "Password must be at least 12 characters." },
						{ message: "Password must contain a number." },
						{ message: "Password must contain a number." },
					]}
				/>
			</Field>
		</div>
	),
};

export const WithFieldSet: Story = {
	render: () => (
		<div className="w-96">
			<FieldSet>
				<FieldLegend>Availability</FieldLegend>
				<FieldDescription>
					Tell clients when you are available for projects.
				</FieldDescription>
				<FieldGroup>
					<Field orientation="horizontal">
						<FieldLabel htmlFor="available-from">From</FieldLabel>
						<Input id="available-from" type="date" />
					</Field>
					<Field orientation="horizontal">
						<FieldLabel htmlFor="available-until">Until</FieldLabel>
						<Input id="available-until" type="date" />
					</Field>
				</FieldGroup>
			</FieldSet>
		</div>
	),
};

export const ResponsiveOrientation: Story = {
	render: () => (
		<div className="w-full max-w-2xl resize-x overflow-auto rounded-lg border border-dashed p-4">
			<FieldGroup>
				<Field orientation="responsive">
					<FieldLabel htmlFor="responsive-name">Full name</FieldLabel>
					<Input id="responsive-name" placeholder="Nathan Guyot" />
				</Field>
				<Field orientation="responsive">
					<FieldLabel htmlFor="responsive-city">City</FieldLabel>
					<Input id="responsive-city" placeholder="Rotterdam" />
				</Field>
			</FieldGroup>
		</div>
	),
};

export const CheckboxCard: Story = {
	render: () => (
		<div className="w-96">
			<FieldSet>
				<FieldLegend variant="label">Notifications</FieldLegend>
				<FieldGroup data-slot="checkbox-group">
					<FieldLabel htmlFor="notify-projects">
						<Field orientation="horizontal">
							<Checkbox id="notify-projects" defaultChecked />
							<FieldContent>
								<FieldTitle>New projects</FieldTitle>
								<FieldDescription>
									Get notified when a client publishes a project matching your
									skills.
								</FieldDescription>
							</FieldContent>
						</Field>
					</FieldLabel>
					<FieldLabel htmlFor="notify-reports">
						<Field orientation="horizontal">
							<Checkbox id="notify-reports" />
							<FieldContent>
								<FieldTitle>Project reports</FieldTitle>
								<FieldDescription>
									Get notified when a deliverable is ready for review.
								</FieldDescription>
							</FieldContent>
						</Field>
					</FieldLabel>
				</FieldGroup>
			</FieldSet>
		</div>
	),
};

export const Disabled: Story = {
	render: () => (
		<div className="w-96">
			<Field data-disabled="true">
				<FieldLabel htmlFor="disabled-business-id">Business ID</FieldLabel>
				<Input
					id="disabled-business-id"
					disabled
					defaultValue="123 456 789 00012"
				/>
				<FieldDescription>
					Verified automatically — contact support to change it.
				</FieldDescription>
			</Field>
		</div>
	),
};
