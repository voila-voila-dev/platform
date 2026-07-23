import { MegaphoneIcon, WarningIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	Banner,
	BannerAction,
	BannerClose,
	BannerTitle,
} from "@voila.dev/ui/components/banner";
import { Button } from "@voila.dev/ui/components/button";
import { useState } from "react";

const meta = {
	title: "UI/Banner",
	component: Banner,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "muted", "success", "warning", "destructive"],
		},
	},
	args: {
		variant: "default",
	},
} satisfies Meta<typeof Banner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<Banner {...args}>
			<MegaphoneIcon />
			<BannerTitle>
				La messagerie est disponible — échangez directement avec les clubs
				depuis une mission.
			</BannerTitle>
			<BannerClose />
		</Banner>
	),
};

export const Muted: Story = {
	args: { variant: "muted" },
	render: (args) => (
		<Banner {...args}>
			<BannerTitle>
				Maintenance planifiée dimanche de 2h à 4h — la plateforme sera
				indisponible.
			</BannerTitle>
			<BannerClose />
		</Banner>
	),
};

export const Success: Story = {
	args: { variant: "success" },
	render: (args) => (
		<Banner {...args}>
			<BannerTitle>
				Votre profil est complet — vous pouvez désormais postuler aux missions.
			</BannerTitle>
			<BannerClose />
		</Banner>
	),
};

export const Warning: Story = {
	args: { variant: "warning" },
	render: (args) => (
		<Banner {...args}>
			<WarningIcon />
			<BannerTitle>
				Votre compte Stripe est incomplet — terminez la configuration pour
				recevoir vos paiements.
			</BannerTitle>
		</Banner>
	),
};

export const Destructive: Story = {
	args: { variant: "destructive" },
	render: (args) => (
		<Banner {...args}>
			<WarningIcon />
			<BannerTitle>
				Le paiement de votre abonnement a échoué — mettez à jour votre moyen de
				paiement.
			</BannerTitle>
		</Banner>
	),
};

export const WithAction: Story = {
	render: (args) => (
		<Banner {...args}>
			<MegaphoneIcon />
			<BannerTitle>
				La messagerie est disponible — échangez directement avec les clubs.
			</BannerTitle>
			<BannerAction>
				<Button
					variant="outline"
					size="xs"
					className="border-current/30 bg-transparent text-current hover:bg-current/10 hover:text-current"
				>
					Découvrir
				</Button>
			</BannerAction>
			<BannerClose />
		</Banner>
	),
};

export const WithLink: Story = {
	args: { variant: "warning" },
	render: (args) => (
		<Banner {...args}>
			<WarningIcon />
			<BannerTitle>
				Soumettez la <a href="#report">fiche de suivi</a> sous 48h pour
				déclencher le paiement.
			</BannerTitle>
		</Banner>
	),
};

export const Dismissible: Story = {
	render: function DismissibleStory(args) {
		const [open, setOpen] = useState(true);
		if (!open) {
			return (
				<div className="p-4">
					<Button variant="outline" size="sm" onClick={() => setOpen(true)}>
						Réafficher la bannière
					</Button>
				</div>
			);
		}
		return (
			<Banner {...args}>
				<MegaphoneIcon />
				<BannerTitle>
					La messagerie est disponible — échangez directement avec les clubs.
				</BannerTitle>
				<BannerClose onClick={() => setOpen(false)} />
			</Banner>
		);
	},
};
