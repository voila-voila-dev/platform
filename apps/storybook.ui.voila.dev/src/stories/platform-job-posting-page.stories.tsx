import {
	BriefcaseIcon,
	CalendarBlankIcon,
	MapPinIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/button";
import {
	type JobPosting,
	type JobPostingCopy,
	JobPostingPage,
} from "@voila.dev/ui-platform/job-posting";

const copy: JobPostingCopy = {
	requirements: "What we look for",
	importance: { required: "Required", preferred: "Preferred" },
	theJob: "The job",
	process: "How hiring works",
	about: (employer) => `About ${employer}`,
	website: "Visit the website",
};

const posting: JobPosting = {
	title: "Senior backend engineer (all genders)",
	employer: {
		name: "Acme",
		website: "https://acme.example",
		description:
			"Acme builds the tools a field team runs its day on, from the first quote to the last invoice.",
	},
	published: "Published on 23 October 2026",
	facts: [
		{
			id: "job",
			icon: <BriefcaseIcon />,
			label: "Engineering · Permanent, full time",
		},
		{
			id: "place",
			icon: <MapPinIcon />,
			label: "12 rue de la République, 69002 Lyon",
		},
		{ id: "start", icon: <CalendarBlankIcon />, label: "As soon as possible" },
	],
	requirements: [
		{
			id: "years",
			label: "Five years building backends",
			importance: "required",
		},
		{ id: "sql", label: "At ease with SQL", importance: "required" },
		{ id: "french", label: "French", importance: "preferred" },
	],
	description:
		"Join the platform team, six engineers who own the API every product calls.\n\nWhat you will do\n- Design the services a new product needs.\n- Keep the ones it already has fast.\n- Review, pair and teach.\n\nWe work from Lyon two days a week.",
	steps: [
		{ title: "You apply", text: "One form, two minutes." },
		{ title: "A first call", text: "Thirty minutes with the team lead." },
		{ title: "A day with us", text: "Paid, on a real problem." },
	],
};

const meta = {
	title: "Platform/Job posting page",
	component: JobPostingPage,
	parameters: { layout: "fullscreen" },
	args: {
		posting,
		copy,
		apply: (
			<div className="flex flex-col gap-3 rounded-2xl border border-border p-6">
				<Button>Apply</Button>
			</div>
		),
	},
} satisfies Meta<typeof JobPostingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutApply: Story = { args: { apply: null } };

export const AnonymousEmployer: Story = {
	args: { posting: { ...posting, employer: { name: "A software company" } } },
};
