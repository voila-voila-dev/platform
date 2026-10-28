import type { ContentNodeLike } from "@voila.dev/ui/content-editor";
import { CardEditor } from "./card-editor";

const row = (
	type: "td" | "th",
	cells: ReadonlyArray<string>,
): ContentNodeLike => ({
	type: "tr",
	children: cells.map((text) => ({
		type,
		children: [{ type: "p", children: [{ text }] }],
	})),
});

export function EmailTable() {
	return (
		<CardEditor
			initial={[
				{
					type: "table",
					headerRow: true,
					columns: [{ align: "left" }, { align: "right" }],
					children: [
						row("th", ["Item", "Price"]),
						row("td", ["Pro plan, 12 months", "€199.00"]),
						row("td", ["Onboarding session", "€90.00"]),
					],
				},
				{ type: "p", children: [{ text: "" }] },
			]}
		/>
	);
}
