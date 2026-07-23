import { cn } from "@voila.dev/ui/lib/utils";

/**
 * Shared fixtures for the Landing stories: French copy mirroring the live
 * marketing site (the original Astro site) so the stories can be visually diffed
 * against it, plus placeholder assets for app-owned images (logos,
 * illustrations).
 */

export function BrandLogo({ className }: { className?: string }) {
	return (
		<span
			className={cn(
				"font-heading text-xl font-bold tracking-tight text-primary",
				className,
			)}
		>
			acme.dev
		</span>
	);
}

export function partnerLogoDataUri(name: string): string {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="48"><rect width="160" height="48" rx="8" fill="#e2e8f0"/><text x="80" y="30" font-family="sans-serif" font-size="16" font-weight="bold" fill="#475569" text-anchor="middle">${name}</text></svg>`;
	return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const partnerNames = [
	"AS Vitré",
	"CJF Fleury",
	"FC Nantes",
	"RC Vannes",
	"Stade Rennais",
	"US Concarneau",
];

/** Stand-in for the app-owned hero/dashboard illustrations. */
export function IllustrationPlaceholder({ label }: { label: string }) {
	return (
		<div className="flex aspect-square w-full items-center justify-center rounded-3xl border border-dashed border-border bg-muted/50">
			<span className="text-sm text-muted-foreground">{label}</span>
		</div>
	);
}

export const heroCopy = {
	badge: "Nouvelle plateforme",
	titleStart: "Trouvez un",
	titleHighlight: "pro de santé",
	titleMiddle: "pour vos",
	titleHighlightEnd: "événements sportifs",
	titleEnd: "grâce à notre appli",
	description:
		"La plateforme qui met en relation clubs de sport et professionnels de santé pour l'accompagnement santé des sportifs en déplacement.",
	ctaClub: "Je suis un club",
	ctaHealthPro: "Je suis professionnel de santé",
	stats: [
		{ value: "20K+", label: "Membres engagés" },
		{ value: "2000+", label: "Professionnels référencés" },
		{ value: "700+", label: "Prestations effectuées" },
	],
};

export const performerTrack = {
	label: "Club",
	subtitle: "Vous organisez un événement sportif",
	steps: [
		{
			title: "Publiez votre annonce",
			description: (
				<>
					Créez une annonce détaillée pour votre besoin -{" "}
					<strong>match, tournoi, compétition, stage</strong> : date, lieu,
					horaires et type de professionnel recherché.
				</>
			),
		},
		{
			title: "Sélectionnez votre professionnel de santé",
			description: (
				<>
					Grâce à un <strong>matching intelligent</strong> sur-mesure,
					choisissez votre praticien parmi les profils intéressés.
				</>
			),
		},
		{
			title: "Profitez du suivi médical",
			description: (
				<>
					Recevez la liste des interventions réalisées et assurez la{" "}
					<strong>continuité médicale</strong> de vos sportifs.
				</>
			),
		},
	],
};

export const helperTrack = {
	label: "Professionnel de santé",
	subtitle: "Vous êtes professionnel de santé",
	steps: [
		{
			title: "Restez informé",
			description: (
				<>
					Recevez une alerte ciblée, consultez les détails de la mission et{" "}
					<strong>postulez</strong> si elle vous intéresse.
				</>
			),
		},
		{
			title: "Réalisez votre intervention",
			description: (
				<>
					<strong>Participez</strong> à l'aventure et profitez de l'expérience
					sur le terrain.
				</>
			),
		},
		{
			title: "Suivez vos prestations",
			description: (
				<>
					Facturation, analytics et bien plus encore : nous{" "}
					<strong>simplifions toute la partie administrative</strong>.
				</>
			),
		},
	],
};

export const organizationBenefits = {
	badge: "Pour les clubs de sport",
	titleStart: "Vos sportifs se déplacent.",
	titleHighlight: "Pas votre staff médical.",
	withoutTitle: "Déplacement classique",
	withoutItems: [
		"Départ sans staff médical - trop cher à déplacer",
		"Un professionnel de santé cherché en urgence, sur place",
		"Blessures gérées avec une trousse incomplète",
		"Aucun suivi médical après le match",
		"Aucun soignant disponible dans les déserts médicaux",
	],
	withTitle: "Avec Acme",
	withItems: [
		"Un professionnel vérifié vous attend sur le lieu du match",
		"Matériel professionnel complet sur place",
		"Vos sportifs soignés et suivis",
		"Zéro frais de transport ou d'hébergement",
		"Des professionnels référencés dans tous les départements de France",
	],
	tags: ["Football", "Rugby", "Basketball", "Handball", "Hockey sur glace"],
	cta: "Trouver un professionnel de santé pour mon club",
};

export const helperBenefits = {
	badge: "Pour les professionnels",
	titleStart: "Cabinet la semaine.",
	titleHighlight: "Terrain le week-end.",
	lead: "Acme est né d'une communauté de +40 000 professionnels de santé passionnés de sport. Des gens comme vous.",
	withoutTitle: "Sans réseau",
	withoutItems: [
		"Des missions sport trouvées au bouche-à-oreille",
		"Des heures à démarcher les clubs sans réponse",
		"Pas (encore) de réseau dans le milieu sportif",
		"Le terrain reste un rêve à côté du cabinet",
	],
	withTitle: "Avec Acme",
	withItems: [
		"Des missions près de chez vous, en quelques clics",
		"Vous choisissez quand et où vous intervenez",
		"Un profil vérifié qui inspire confiance aux clubs",
		"Un réseau dans le sport qui grandit à chaque mission",
	],
	tags: [
		"Kinésithérapeute",
		"Médecin",
		"Ostéopathe",
		"Préparateur physique",
		"Diététicien",
		"Infirmier",
	],
	cta: "Rejoindre le mouvement",
};

export const testimonials = [
	{
		quote:
			"Trouver un kiné pour nos matchs relevait du parcours du combattant. Aujourd'hui, on publie notre besoin et on est rappelés dans la journée.",
		name: "Responsable de club",
		role: "Football amateur",
		accent: "primary",
	},
	{
		quote:
			"J'interviens sur des événements près de chez moi, avec un cadre clair. Acme m'a permis de développer mon activité dans le sport.",
		name: "Kinésithérapeute du sport",
		role: "Membre du réseau",
		accent: "orange",
	},
	{
		quote:
			"Être suivi par un pro pendant la saison a tout changé : moins de blessures, et le sentiment d'être enfin pris au sérieux.",
		name: "Joueur semi-pro",
		role: "Sportif accompagné",
		accent: "primary",
	},
] as const;

export const values = [
	{
		title: "Réactivité",
		description:
			"Au plus proche de vous, nous sommes réactifs pour cibler et répondre précisément à vos besoins. Des offres sur-mesure pour redonner un élan et bâtir un réel mouvement autour de la santé et combler les manques dans le suivi médical sportif.",
	},
	{
		title: "Simplicité",
		description:
			"Le circuit médical est un labyrinthe. En proposant cette mise en relation, nous gérons l'entièreté des aspects du processus. De la recherche à la facturation, en passant par le matching intelligent et l'ensemble de l'administratif.",
	},
	{
		title: "Fidélité",
		description:
			"Nous voyons en vous de véritables partenaires et avons à cœur de bâtir une relation de confiance solide et pérenne.",
	},
];

export const ctaBanner = {
	title: "Rejoignez l'aventure Acme",
	description:
		"Club ou professionnel de santé : construisons ensemble un sport amateur plus sain, mieux accompagné et durable.",
};

export const mainNavigation = [
	{ title: "Comment ça marche ?", href: "/#how-it-works" },
	{ title: "Pour les clubs", href: "/#club-benefits" },
	{ title: "Pour les pros", href: "/#health-pro-benefits" },
	{ title: "Boutique", href: "https://shop.acme.dev" },
];

export const footerNavigation = [
	{
		title: "Plateforme",
		items: [
			{ title: "Comment ça marche ?", href: "/#how-it-works" },
			{ title: "Pour les clubs", href: "/#club-benefits" },
			{ title: "Pour les professionnels", href: "/#health-pro-benefits" },
			{ title: "Boutique", href: "https://shop.acme.dev" },
		],
	},
	{
		title: "Ressources",
		items: [
			{ title: "Blog", href: "/blog" },
			{ title: "À propos", href: "/a-propos" },
			{ title: "Contact", href: "/contact" },
		],
	},
	{
		title: "Légal",
		items: [
			{ title: "Mentions légales", href: "/mentions-legales" },
			{ title: "Politique de confidentialité", href: "/confidentialite" },
			{ title: "CGU", href: "/cgu" },
		],
	},
	{
		title: "Contact",
		items: [
			{ title: "contact@acme.dev", href: "mailto:contact@acme.dev" },
			{ title: "+33 6 47 67 24 72", href: "tel:+33647672472" },
		],
	},
];
