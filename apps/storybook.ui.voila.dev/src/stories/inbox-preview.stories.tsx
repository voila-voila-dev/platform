import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { InboxPreview } from "@voila.dev/ui/inbox-preview";

const meta = {
	title: "UI/InboxPreview",
	component: InboxPreview,
	tags: ["autodocs"],
} satisfies Meta<typeof InboxPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		sender: "Acme",
		subject: "Your September invoice is ready",
		preheader: "Due on the 30th, payable online.",
	},
};

/** Where the two mocks stop agreeing: the phone cuts the subject long before
 * the desktop row does, which is the whole reason both are on screen. */
export const LongSubject: Story = {
	args: {
		sender: "Acme",
		subject: "Your September invoice is ready, and so is the yearly summary",
		preheader:
			"Everything you were billed for since January, one line per project, payable online until the 30th.",
	},
};

/** Nothing written yet: the subject reads as a placeholder rather than as an
 * empty row, and the preheader simply leaves the room to the client. */
export const Empty: Story = {
	args: { sender: "Acme", subject: "" },
};

/** Every string is overridable, one key at a time. */
export const Translated: Story = {
	args: {
		sender: "Acme",
		subject: "Votre facture de septembre est prête",
		preheader: "À régler avant le 30, en ligne.",
		labels: {
			desktop: "Ordinateur",
			mobile: "Téléphone",
			inbox: "Boîte de réception",
			time: "à l'instant",
			emptySubject: "(Sans objet)",
		},
	},
};
