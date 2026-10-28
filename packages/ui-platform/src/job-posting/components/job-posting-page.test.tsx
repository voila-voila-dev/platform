// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { JobPostingPage } from "#/job-posting/components/job-posting-page.tsx";
import type {
	JobPosting,
	JobPostingCopy,
} from "#/job-posting/lib/job-posting.ts";

afterEach(cleanup);

const copy: JobPostingCopy = {
	requirements: "What we look for",
	importance: { required: "Required", preferred: "Preferred" },
	theJob: "The job",
	process: "How hiring works",
	about: (employer) => `About ${employer}`,
	website: "Visit the website",
};

const posting: JobPosting = {
	title: "Backend engineer",
	employer: {
		name: "Acme",
		website: "https://acme.example",
		description: "We build anvils.",
	},
	published: "Published on 23 October 2026",
	facts: [{ id: "place", icon: null, label: "Lyon" }],
	requirements: [
		{ id: "go", label: "Five years of Go", importance: "required" },
		{ id: "sql", label: "SQL", importance: "preferred" },
	],
	description: "Join the platform team.\n\nWhat you will do\n- Build.\n- Ship.",
	steps: [{ title: "You apply", text: "One form, two minutes." }],
};

function page(overrides: Partial<JobPosting> = {}) {
	return render(
		<JobPostingPage
			posting={{ ...posting, ...overrides }}
			copy={copy}
			apply={<button type="button">Apply</button>}
		/>,
	);
}

describe("JobPostingPage", () => {
	it("tells about the employer, with its website", () => {
		const screen = page();
		expect(screen.getByText("About Acme")).not.toBeNull();
		expect(
			screen.getByText("Visit the website").closest("a")?.getAttribute("href"),
		).toBe("https://acme.example");
	});

	it("leaves out the about section for an employer known by name only", () => {
		const screen = page({ employer: { name: "A software company" } });
		expect(screen.queryByText("About A software company")).toBeNull();
	});

	it("marks each requirement as required or preferred in words", () => {
		const screen = page();
		expect(
			screen.getByText("Five years of Go").closest("li")?.textContent,
		).toBe("Five years of GoRequired");
		expect(screen.getByText("SQL").closest("li")?.textContent).toBe(
			"SQLPreferred",
		);
	});

	it("numbers the hiring steps after the job", () => {
		const screen = page();
		expect(screen.getByText("You apply").closest("li")?.textContent).toBe(
			"1You applyOne form, two minutes.",
		);
	});

	it("lays the description out as a paragraph, a subheading and a list", () => {
		const article = page().container.querySelector("article");
		expect([
			article?.querySelector("p")?.textContent,
			article?.querySelector("h3")?.textContent,
			[...(article?.querySelectorAll("li") ?? [])].map((li) => li.textContent),
		]).toEqual([
			"Join the platform team.",
			"What you will do",
			["Build.", "Ship."],
		]);
	});

	it("takes the whole width without a way to apply", () => {
		const screen = render(
			<JobPostingPage posting={posting} copy={copy} apply={null} />,
		);
		expect(screen.queryByRole("button", { name: "Apply" })).toBeNull();
	});
});
