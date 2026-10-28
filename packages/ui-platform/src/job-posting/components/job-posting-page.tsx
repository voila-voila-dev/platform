import { ArrowSquareOutIcon, CheckIcon } from "@phosphor-icons/react";
import { cn } from "@voila.dev/ui/utils";
import { Container, ProseArticle } from "@voila.dev/ui-landing";
import type { ReactNode } from "react";
import {
	type DescriptionBlock,
	descriptionBlocks,
} from "#/job-posting/lib/description-blocks.ts";
import type {
	JobPosting,
	JobPostingCopy,
	JobPostingEmployer,
	JobPostingImportance,
} from "#/job-posting/lib/job-posting.ts";

interface Props {
	readonly posting: JobPosting;
	readonly copy: JobPostingCopy;
	/** The posting's photos, drawn by the host's gallery between the title and the facts. */
	readonly gallery?: ReactNode;
	/** Above the title: the way back to the list, or a preview's banner. */
	readonly top?: ReactNode;
	/** The way to apply beside the page; `null` gives the page the whole width. */
	readonly apply: ReactNode;
}

function SectionTitle({ children }: { readonly children: ReactNode }) {
	return (
		<h2 className="font-heading text-xl font-semibold tracking-tight text-foreground md:text-[1.375rem]">
			{children}
		</h2>
	);
}

function Facts({ posting }: { readonly posting: JobPosting }) {
	return (
		<ul className="flex flex-col gap-5">
			{posting.facts.map((fact) => (
				<li key={fact.id} className="flex items-center gap-4">
					<span className="flex shrink-0 text-foreground [&>svg]:size-6">
						{fact.icon}
					</span>
					<span className="text-foreground">{fact.label}</span>
				</li>
			))}
		</ul>
	);
}

function EmployerLogo({
	employer,
	size,
}: {
	readonly employer: JobPostingEmployer;
	readonly size: "sm" | "lg";
}) {
	if (employer.logo === undefined) return null;
	return (
		<img
			src={employer.logo.src}
			srcSet={employer.logo.srcSet}
			sizes={size === "sm" ? "48px" : "64px"}
			alt={employer.name}
			className={
				size === "sm"
					? "size-12 shrink-0 rounded-full border border-border bg-white object-contain p-1"
					: "size-16 shrink-0 rounded-2xl border border-border bg-white object-contain p-1.5"
			}
		/>
	);
}

function About({
	employer,
	copy,
}: {
	readonly employer: JobPostingEmployer;
	readonly copy: JobPostingCopy;
}) {
	if (employer.description === undefined && employer.website === undefined) {
		return null;
	}
	return (
		<section className="flex flex-col gap-4 border-t border-border pt-8">
			<h2 className="sr-only">{copy.about(employer.name)}</h2>
			<div className="flex items-center gap-4">
				<EmployerLogo employer={employer} size="lg" />
				<span className="font-heading text-lg font-semibold text-foreground">
					{employer.name}
				</span>
			</div>
			{employer.description === undefined ? null : (
				<p className="whitespace-pre-line text-foreground/90">
					{employer.description}
				</p>
			)}
			{employer.website === undefined ? null : (
				<a
					href={employer.website}
					target="_blank"
					rel="noopener"
					className="flex w-fit items-center gap-1.5 font-medium text-foreground underline underline-offset-4"
				>
					{copy.website}
					<ArrowSquareOutIcon className="size-4" />
				</a>
			)}
		</section>
	);
}

function Process({
	posting,
	copy,
}: {
	readonly posting: JobPosting;
	readonly copy: JobPostingCopy;
}) {
	if (posting.steps.length === 0) return null;
	return (
		<section className="flex flex-col gap-4 border-t border-border pt-8">
			<SectionTitle>{copy.process}</SectionTitle>
			<ol className="flex flex-col gap-5">
				{posting.steps.map((step, index) => (
					<li key={step.title} className="flex gap-4">
						<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand/10 font-heading text-sm font-semibold text-brand tabular-nums">
							{index + 1}
						</span>
						<span className="flex flex-col gap-0.5">
							<span className="font-medium text-foreground">{step.title}</span>
							<span className="text-foreground/80">{step.text}</span>
						</span>
					</li>
				))}
			</ol>
		</section>
	);
}

function Block({ block }: { readonly block: DescriptionBlock }) {
	if (block.kind === "heading") return <h3>{block.text}</h3>;
	if (block.kind === "list") {
		return (
			<ul>
				{block.items.map((item) => (
					<li key={item}>{item}</li>
				))}
			</ul>
		);
	}
	return <p className="whitespace-pre-line">{block.text}</p>;
}

function blockKey(block: DescriptionBlock): string {
	return block.kind === "list"
		? `list:${block.items.join("|")}`
		: `${block.kind}:${block.text}`;
}

/** The description in long-form typography, laid out from its plain text. */
function Description({ text }: { readonly text: string }) {
	return (
		<ProseArticle className="mx-0 max-w-none text-base leading-relaxed md:text-base md:leading-relaxed prose-h3:mt-6 prose-h3:mb-2 prose-h3:text-lg md:prose-h3:text-lg prose-p:my-3 prose-ul:my-3">
			{descriptionBlocks(text).map((block) => (
				<Block key={blockKey(block)} block={block} />
			))}
		</ProseArticle>
	);
}

/** Full for what is required, tinted for what is preferred. */
const IMPORTANCE_LOOK: Record<
	JobPostingImportance,
	{ readonly mark: string; readonly pill: string }
> = {
	required: {
		mark: "bg-brand text-brand-foreground",
		pill: "bg-brand/10 text-brand",
	},
	preferred: {
		mark: "bg-brand/10 text-brand",
		pill: "bg-muted text-muted-foreground",
	},
};

function Requirements({
	posting,
	copy,
}: {
	readonly posting: JobPosting;
	readonly copy: JobPostingCopy;
}) {
	if (posting.requirements.length === 0) return null;
	return (
		<section className="flex flex-col gap-4 border-t border-border pt-8">
			<SectionTitle>{copy.requirements}</SectionTitle>
			<ul className="flex flex-col gap-3">
				{posting.requirements.map((requirement) => {
					const look = IMPORTANCE_LOOK[requirement.importance];
					return (
						<li key={requirement.id} className="flex items-center gap-3">
							<span
								className={cn(
									"flex size-6 shrink-0 items-center justify-center rounded-full",
									look.mark,
								)}
							>
								<CheckIcon weight="bold" className="size-3.5" />
							</span>
							<span className="flex-1 text-foreground">
								{requirement.label}
							</span>
							<span
								className={cn(
									"shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
									look.pill,
								)}
							>
								{copy.importance[requirement.importance]}
							</span>
						</li>
					);
				})}
			</ul>
		</section>
	);
}

/**
 * A job posting as it reads online: its photos first, then its facts, the
 * profile it asks for, the employer behind it and the job, with the way to
 * apply beside. A public page and a staff preview can render this one
 * component, so what the staff check is what goes online.
 */
export function JobPostingPage({ posting, copy, gallery, top, apply }: Props) {
	return (
		<Container size="lg" className="flex flex-col gap-6 pt-3 pb-16 md:pt-6">
			{top}
			<header className="flex flex-col gap-3">
				<h1 className="font-heading text-2xl leading-tight font-semibold tracking-tight text-balance text-foreground md:text-[1.75rem]">
					{posting.title}
				</h1>
				<div className="flex items-center gap-3">
					<EmployerLogo employer={posting.employer} size="sm" />
					<div className="flex flex-col">
						<span className="font-medium text-foreground">
							{posting.employer.name}
						</span>
						<span className="text-sm text-muted-foreground">
							{posting.published}
						</span>
					</div>
				</div>
			</header>
			{gallery}
			{/* Its own width decides, not the screen's: a preview may sit between two side panels. */}
			<div className="@container">
				<div
					className={
						apply === null
							? "grid gap-10 pt-2"
							: "grid gap-10 pt-2 @5xl:grid-cols-[minmax(0,1fr)_22rem] @5xl:gap-16"
					}
				>
					{/* A line of text reads best under ~70 characters, even with the whole width free. */}
					<div className="flex max-w-3xl flex-col gap-8">
						<Facts posting={posting} />
						<Requirements posting={posting} copy={copy} />
						<About employer={posting.employer} copy={copy} />
						<section className="flex flex-col gap-4 border-t border-border pt-8">
							<SectionTitle>{copy.theJob}</SectionTitle>
							<Description text={posting.description} />
						</section>
						<Process posting={posting} copy={copy} />
					</div>
					{apply === null ? null : (
						<div className="@5xl:sticky @5xl:top-24 @5xl:self-start">
							{apply}
						</div>
					)}
				</div>
			</div>
		</Container>
	);
}
