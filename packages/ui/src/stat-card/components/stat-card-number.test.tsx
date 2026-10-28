// @vitest-environment node
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { StatCard } from "#/stat-card/components/stat-card.tsx";

describe("StatCard.Value on the server", () => {
	it("renders the final formatted value", () => {
		const html = renderToString(
			<StatCard.Value value={1280.5} format={new Intl.NumberFormat("en-US")} />,
		);
		expect(html).toContain("1,280.5");
	});

	it("keeps the target's decimals by default", () => {
		expect(renderToString(<StatCard.Value value={12.5} />)).toContain("12.5");
	});
});
