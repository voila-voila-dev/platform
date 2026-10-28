import type { ReactNode } from "react";

/** An image the page draws: its URL and, for a host that resizes, its `srcset`. */
export interface JobPostingImage {
	readonly src: string;
	readonly srcSet?: string;
}

/** Who hires. A host that keeps an employer anonymous passes a name and nothing else. */
export interface JobPostingEmployer {
	readonly name: string;
	readonly logo?: JobPostingImage;
	readonly description?: string;
	readonly website?: string;
}

/** One line of the facts under the photos: the job, the place, the start, the pay… */
export interface JobPostingFact {
	readonly id: string;
	readonly icon: ReactNode;
	readonly label: ReactNode;
}

export type JobPostingImportance = "required" | "preferred";

export interface JobPostingRequirement {
	readonly id: string;
	readonly label: string;
	readonly importance: JobPostingImportance;
}

/** One step of what happens once the candidate applies. */
export interface JobPostingStep {
	readonly title: string;
	readonly text: string;
}

/**
 * A job posting ready to print: every value already in the reader's language,
 * so the page decides only how it looks.
 */
export interface JobPosting {
	readonly title: string;
	readonly employer: JobPostingEmployer;
	/** "Published on 23 October 2026". */
	readonly published: string;
	readonly facts: ReadonlyArray<JobPostingFact>;
	readonly requirements: ReadonlyArray<JobPostingRequirement>;
	/** Plain text: blank lines part paragraphs, "- " starts a list item. */
	readonly description: string;
	readonly steps: ReadonlyArray<JobPostingStep>;
}

/** The page's own words. */
export interface JobPostingCopy {
	readonly requirements: string;
	readonly importance: Readonly<Record<JobPostingImportance, string>>;
	readonly theJob: string;
	readonly process: string;
	readonly about: (employer: string) => string;
	readonly website: string;
}
