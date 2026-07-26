import { CopyIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { InputGroup } from "@voila.dev/ui/input-group";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
	title: "UI/InputGroup",
	component: InputGroup.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof InputGroup.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="w-80">
			<InputGroup.Root>
				<InputGroup.Addon>
					<MagnifyingGlassIcon />
				</InputGroup.Addon>
				<InputGroup.Input placeholder="Search freelancers..." />
			</InputGroup.Root>
		</div>
	),
};

export const WithPrefixText: Story = {
	render: () => (
		<div className="w-80">
			<InputGroup.Root>
				<InputGroup.Addon>
					<InputGroup.Text>https://</InputGroup.Text>
				</InputGroup.Addon>
				<InputGroup.Input placeholder="your-site.example" />
			</InputGroup.Root>
		</div>
	),
};

export const WithButton: Story = {
	render: () => (
		<div className="w-80">
			<InputGroup.Root>
				<InputGroup.Input
					readOnly
					defaultValue="https://acme.dev/invite/8f2a"
				/>
				<InputGroup.Addon align="inline-end">
					<InputGroup.Button size="icon-xs" aria-label="Copy invite link">
						<CopyIcon />
					</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
		</div>
	),
};

export const WithTextarea: Story = {
	render: () => (
		<div className="w-80">
			<InputGroup.Root>
				{/* `rows` is inert on the kit Textarea (field-sizing-content) - size with min-h-* instead. */}
				<InputGroup.Textarea
					placeholder="Describe the project for freelancers..."
					className="min-h-24"
				/>
				<InputGroup.Addon align="block-end">
					<InputGroup.Text>Visible to applicants</InputGroup.Text>
				</InputGroup.Addon>
			</InputGroup.Root>
		</div>
	),
};

export const WithBlockStartAddon: Story = {
	render: () => (
		<div className="w-80">
			<InputGroup.Root>
				<InputGroup.Addon align="block-start">
					<InputGroup.Text>Project brief</InputGroup.Text>
				</InputGroup.Addon>
				<InputGroup.Textarea placeholder="Describe the project for freelancers..." />
			</InputGroup.Root>
		</div>
	),
};

export const WithBothAddons: Story = {
	render: () => (
		<div className="w-80">
			<InputGroup.Root>
				<InputGroup.Addon>
					<InputGroup.Text>https://</InputGroup.Text>
				</InputGroup.Addon>
				<InputGroup.Input placeholder="your-site" />
				<InputGroup.Addon align="inline-end">
					<InputGroup.Text>.example</InputGroup.Text>
				</InputGroup.Addon>
			</InputGroup.Root>
		</div>
	),
};

export const Disabled: Story = {
	render: () => (
		<div className="w-80">
			<InputGroup.Root>
				<InputGroup.Addon>
					<MagnifyingGlassIcon />
				</InputGroup.Addon>
				<InputGroup.Input placeholder="Search freelancers..." disabled />
			</InputGroup.Root>
		</div>
	),
};

export const Invalid: Story = {
	render: () => (
		<div className="w-80">
			<InputGroup.Root>
				<InputGroup.Addon>
					<InputGroup.Text>https://</InputGroup.Text>
				</InputGroup.Addon>
				<InputGroup.Input
					placeholder="your-site.example"
					aria-invalid
					defaultValue="not a url"
				/>
			</InputGroup.Root>
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
			<InputGroup.Root>
				<InputGroup.Addon>
					<InputGroup.Text>https://</InputGroup.Text>
				</InputGroup.Addon>
				<InputGroup.Input placeholder="your-site.example" />
			</InputGroup.Root>
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
