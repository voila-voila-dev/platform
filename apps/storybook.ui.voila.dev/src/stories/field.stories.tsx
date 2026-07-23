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
					<FieldLabel htmlFor="organization-name">Club name</FieldLabel>
					<Input id="organization-name" placeholder="Clermont Rugby Club" />
					<FieldDescription>
						Shown to providers on every mission you publish.
					</FieldDescription>
				</Field>
				<Field>
					<FieldLabel htmlFor="contact-email">Contact email</FieldLabel>
					<Input
						id="contact-email"
						type="email"
						placeholder="staff@club.example"
					/>
				</Field>
				<FieldSeparator>Optional</FieldSeparator>
				<Field>
					<FieldLabel htmlFor="mission-notes">Mission notes</FieldLabel>
					<Textarea
						id="mission-notes"
						placeholder="Access instructions, parking, equipment..."
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
				<FieldLabel htmlFor="rpps-number">RPPS number</FieldLabel>
				<Input
					id="rpps-number"
					aria-invalid
					aria-describedby="rpps-number-error"
					defaultValue="123"
				/>
				<FieldError
					id="rpps-number-error"
					errors={[{ message: "RPPS number must be 11 digits." }]}
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
					Tell clubs when you are available for missions.
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
					<Input id="responsive-city" placeholder="Clermont-Ferrand" />
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
					<FieldLabel htmlFor="notify-missions">
						<Field orientation="horizontal">
							<Checkbox id="notify-missions" defaultChecked />
							<FieldContent>
								<FieldTitle>New missions</FieldTitle>
								<FieldDescription>
									Get notified when a club publishes a mission matching your
									skills.
								</FieldDescription>
							</FieldContent>
						</Field>
					</FieldLabel>
					<FieldLabel htmlFor="notify-reports">
						<Field orientation="horizontal">
							<Checkbox id="notify-reports" />
							<FieldContent>
								<FieldTitle>Mission reports</FieldTitle>
								<FieldDescription>
									Get notified when a fiche de suivi is ready for review.
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
				<FieldLabel htmlFor="disabled-siret">SIRET</FieldLabel>
				<Input id="disabled-siret" disabled defaultValue="123 456 789 00012" />
				<FieldDescription>
					Verified automatically — contact support to change it.
				</FieldDescription>
			</Field>
		</div>
	),
};
