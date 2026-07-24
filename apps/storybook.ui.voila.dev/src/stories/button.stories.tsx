import { ArrowRightIcon, PlusIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	buttonSizeOptions,
	buttonVariantOptions,
} from "@voila.dev/ui/button-variants";
import { Button } from "@voila.dev/ui/components/button";

const meta = {
	title: "UI/Button",
	component: Button,
	tags: ["autodocs"],
	args: {
		children: "Button",
	},
	argTypes: {
		variant: {
			control: "select",
			options: buttonVariantOptions,
		},
		size: {
			control: "select",
			options: buttonSizeOptions,
		},
		loading: {
			control: "boolean",
		},
		disabled: {
			control: "boolean",
		},
	},
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// `default` and `primary` render identically (primary is the marketing alias).
export const Variants: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-4">
			{buttonVariantOptions.map((variant) => (
				<Button key={variant} variant={variant}>
					{variant}
				</Button>
			))}
		</div>
	),
};

// Text sizes only: xs < sm < default < lg (`default` is the unmarked middle).
export const Sizes: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-4">
			<Button size="xs">Extra small</Button>
			<Button size="sm">Small</Button>
			<Button size="default">Default</Button>
			<Button size="lg">Large</Button>
		</div>
	),
};

export const IconSizes: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-4">
			<Button size="icon-xs" aria-label="Add">
				<PlusIcon />
			</Button>
			<Button size="icon-sm" aria-label="Add">
				<PlusIcon />
			</Button>
			<Button size="icon" aria-label="Add">
				<PlusIcon />
			</Button>
			<Button size="icon-lg" aria-label="Add">
				<PlusIcon />
			</Button>
		</div>
	),
};

// Set `data-icon="inline-start" | "inline-end"` on the icon so the cva trims
// the padding on that side (see `has-data-[icon=...]` in button-variants.ts).
export const WithIcon: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-4">
			<Button>
				<PlusIcon data-icon="inline-start" />
				Add project
			</Button>
			<Button variant="outline">
				Next
				<ArrowRightIcon data-icon="inline-end" />
			</Button>
		</div>
	),
};

export const Disabled: Story = {
	args: { disabled: true },
};

export const Loading: Story = {
	args: { loading: true, children: "Saving" },
};

// Base UI's `render` prop is the asChild equivalent - render as a real anchor
// and the solid `[a]:hover` feedback kicks in.
export const AsLink: Story = {
	render: () => (
		<Button render={<a href="https://acme.dev">Visit acme.dev</a>} />
	),
};
