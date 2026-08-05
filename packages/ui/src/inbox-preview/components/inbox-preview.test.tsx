// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { InboxPreview } from "#/inbox-preview/components/inbox-preview.tsx";

afterEach(cleanup);

describe("InboxPreview", () => {
	it("shows the sender, subject and preheader in both mocks", () => {
		const { getAllByText } = render(
			<InboxPreview
				sender="Acme"
				subject="Your invoice is ready"
				preheader="Due on the 30th"
			/>,
		);

		expect(getAllByText("Acme")).toHaveLength(2);
		expect(getAllByText("Your invoice is ready")).toHaveLength(2);
		// The desktop row runs the preheader on after the subject, so its copy is
		// prefixed by the separator; the phone row has it on its own lines.
		expect(getAllByText(/Due on the 30th/)).toHaveLength(2);
	});

	it("stands in for a subject that has not been written yet", () => {
		const { getAllByText, queryByText } = render(
			<InboxPreview sender="Acme" subject="   " />,
		);

		expect(getAllByText("(No subject)")).toHaveLength(2);
		expect(queryByText("—")).toBeNull();
	});

	it("takes its copy from `labels`", () => {
		const { getAllByText } = render(
			<InboxPreview
				sender="Acme"
				subject=""
				labels={{ inbox: "Boîte de réception", emptySubject: "(Sans objet)" }}
			/>,
		);

		expect(getAllByText("Boîte de réception")).toHaveLength(2);
		expect(getAllByText("(Sans objet)")).toHaveLength(2);
	});
});
