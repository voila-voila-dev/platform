import { CopyIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
} from "@voila.dev/ui/components/input-group";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
	title: "UI/InputGroup",
	component: InputGroup,
	tags: ["autodocs"],
} satisfies Meta<typeof InputGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="w-80">
			<InputGroup>
				<InputGroupAddon>
					<MagnifyingGlassIcon />
				</InputGroupAddon>
				<InputGroupInput placeholder="Search freelancers..." />
			</InputGroup>
		</div>
	),
};

export const WithPrefixText: Story = {
	render: () => (
		<div className="w-80">
			<InputGroup>
				<InputGroupAddon>
					<InputGroupText>https://</InputGroupText>
				</InputGroupAddon>
				<InputGroupInput placeholder="your-site.example" />
			</InputGroup>
		</div>
	),
};

export const WithButton: Story = {
	render: () => (
		<div className="w-80">
			<InputGroup>
				<InputGroupInput readOnly defaultValue="https://acme.dev/invite/8f2a" />
				<InputGroupAddon align="inline-end">
					<InputGroupButton size="icon-xs" aria-label="Copy invite link">
						<CopyIcon />
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
		</div>
	),
};

export const WithTextarea: Story = {
	render: () => (
		<div className="w-80">
			<InputGroup>
				{/* `rows` is inert on the kit Textarea (field-sizing-content) - size with min-h-* instead. */}
				<InputGroupTextarea
					placeholder="Describe the project for freelancers..."
					className="min-h-24"
				/>
				<InputGroupAddon align="block-end">
					<InputGroupText>Visible to applicants</InputGroupText>
				</InputGroupAddon>
			</InputGroup>
		</div>
	),
};

export const WithBlockStartAddon: Story = {
	render: () => (
		<div className="w-80">
			<InputGroup>
				<InputGroupAddon align="block-start">
					<InputGroupText>Project brief</InputGroupText>
				</InputGroupAddon>
				<InputGroupTextarea placeholder="Describe the project for freelancers..." />
			</InputGroup>
		</div>
	),
};

export const WithBothAddons: Story = {
	render: () => (
		<div className="w-80">
			<InputGroup>
				<InputGroupAddon>
					<InputGroupText>https://</InputGroupText>
				</InputGroupAddon>
				<InputGroupInput placeholder="your-site" />
				<InputGroupAddon align="inline-end">
					<InputGroupText>.example</InputGroupText>
				</InputGroupAddon>
			</InputGroup>
		</div>
	),
};

export const Disabled: Story = {
	render: () => (
		<div className="w-80">
			<InputGroup>
				<InputGroupAddon>
					<MagnifyingGlassIcon />
				</InputGroupAddon>
				<InputGroupInput placeholder="Search freelancers..." disabled />
			</InputGroup>
		</div>
	),
};

export const Invalid: Story = {
	render: () => (
		<div className="w-80">
			<InputGroup>
				<InputGroupAddon>
					<InputGroupText>https://</InputGroupText>
				</InputGroupAddon>
				<InputGroupInput
					placeholder="your-site.example"
					aria-invalid
					defaultValue="not a url"
				/>
			</InputGroup>
		</div>
	),
};

/**
 * Clicking the addon's empty space forwards focus to the control, and typing
 * lands in the input - exercised here so the canvas captures the focus ring.
 */
export const ClickAddonToFocus: Story = {
	render: () => (
		<div className="w-80">
			<InputGroup>
				<InputGroupAddon>
					<InputGroupText>https://</InputGroupText>
				</InputGroupAddon>
				<InputGroupInput placeholder="your-site.example" />
			</InputGroup>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByPlaceholderText("your-site.example");

		await userEvent.click(canvas.getByText("https://"));
		await waitFor(() => expect(input).toHaveFocus());

		await userEvent.keyboard("acme.dev");
		await expect(input).toHaveValue("acme.dev");
	},
};
