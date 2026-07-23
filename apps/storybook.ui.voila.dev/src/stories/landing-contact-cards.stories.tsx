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
				<ContactCards.CardTitle>Par téléphone</ContactCards.CardTitle>
				<ContactCards.CardDescription>
					Du lundi au vendredi, de 9h à 18h.
				</ContactCards.CardDescription>
				<Button
					variant="outline"
					render={<a href="tel:+33647672472">+33 6 47 67 24 72</a>}
				/>
			</ContactCards.Card>
		</ContactCards.Root>
	),
};
