import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import { ContactCards } from "@voila.dev/ui-landing/components/contact-cards";

const meta = {
	title: "Landing/ContactCards",
	component: ContactCards.Root,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
} satisfies Meta<typeof ContactCards.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Reproduces the contact cards of the original Astro site's `pages/contact.astro`. */
export const Default: Story = {
	render: () => (
		<ContactCards.Root>
			<ContactCards.Card>
				<ContactCards.CardTitle>Par email</ContactCards.CardTitle>
				<ContactCards.CardDescription>
					Pour toute question sur la plateforme ou un partenariat.
				</ContactCards.CardDescription>
				<Button
					variant="outline"
					render={<a href="mailto:contact@acme.dev">contact@acme.dev</a>}
				/>
			</ContactCards.Card>

			<ContactCards.Card>
				<ContactCards.CardTitle>By phone</ContactCards.CardTitle>
				<ContactCards.CardDescription>
					Monday to Friday, 9am to 6pm.
				</ContactCards.CardDescription>
				<Button
					variant="outline"
					render={<a href="tel:+15550134567">+1 (555) 013-4567</a>}
				/>
			</ContactCards.Card>
		</ContactCards.Root>
	),
};
