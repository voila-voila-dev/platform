import { describe, expect, it } from "vitest";
import {
	clearFilterValue,
	countActiveFilters,
	describeFilterValue,
	isFilterValueEmpty,
	setFilterValue,
} from "#/lib/filter-values.ts";
import {
	defaultFilterLabels,
	type FilterDefinition,
	type FilterValues,
} from "#/types.ts";

const statusDefinition: FilterDefinition = {
	kind: "select",
	key: "status",
	label: "Status",
	multiple: true,
	allowExclusion: true,
	options: [
		{ value: "sent", label: "Sent" },
		{ value: "failed", label: "Failed" },
		{ value: "suppressed", label: "Suppressed" },
	],
};

describe("isFilterValueEmpty", () => {
	it("treats blank text as empty", () => {
		expect(isFilterValueEmpty({ kind: "text", text: "   " })).toBe(true);
		expect(isFilterValueEmpty({ kind: "text", text: "camille" })).toBe(false);
	});

	it("treats a range with no bound as empty", () => {
		expect(isFilterValueEmpty({ kind: "numberRange" })).toBe(true);
		expect(isFilterValueEmpty({ kind: "numberRange", min: 0 })).toBe(false);
	});

	it("keeps a false boolean, which is a real filter", () => {
		expect(isFilterValueEmpty({ kind: "boolean", value: false })).toBe(false);
	});
});

describe("setFilterValue", () => {
	it("drops the key when the value is empty", () => {
		const values = setFilterValue({}, "recipient", {
			kind: "text",
			text: "camille",
		});
		expect(countActiveFilters(values)).toBe(1);
		expect(
			countActiveFilters(
				setFilterValue(values, "recipient", { kind: "text", text: "" }),
			),
		).toBe(0);
	});

	it("does not mutate the record it is given", () => {
		const values: FilterValues = {};
		setFilterValue(values, "recipient", { kind: "text", text: "camille" });
		expect(values).toEqual({});
	});

	it("clears a single key", () => {
		const values = setFilterValue({}, "status", {
			kind: "select",
			values: ["sent"],
		});
		expect(clearFilterValue(values, "status")).toEqual({});
	});
});

describe("describeFilterValue", () => {
	const describe_ = (
		value: Parameters<typeof describeFilterValue>[0]["value"],
		definition: FilterDefinition = statusDefinition,
	) =>
		describeFilterValue({
			definition,
			value,
			labels: defaultFilterLabels,
			locale: "en-US",
		});

	it("states the operator of an inverted filter", () => {
		expect(
			describe_({ kind: "select", values: ["sent"], excluded: true }),
		).toBe("Status is not Sent");
	});

	it("summarises more than two selections as a count", () => {
		expect(
			describe_({
				kind: "select",
				values: ["sent", "failed", "suppressed"],
			}),
		).toBe("Status is 3 selected");
	});

	it("reads an open-ended range as a single bound", () => {
		expect(
			describe_(
				{ kind: "numberRange", min: 10 },
				{
					kind: "numberRange",
					key: "radius",
					label: "Radius",
					unit: "km",
				},
			),
		).toBe("Radius: ≥ 10 km");
	});

	it("formats money from minor units", () => {
		expect(
			describe_(
				{ kind: "moneyRange", min: 12000, max: 25050 },
				{
					kind: "moneyRange",
					key: "price",
					label: "Price",
					currency: "EUR",
				},
			),
		).toBe("Price: €120 – €250.50");
	});

	it("reads a radius as an area around the place", () => {
		expect(
			describe_(
				{
					kind: "geoRadius",
					place: {
						id: "nantes",
						label: "Nantes",
						latitude: 47.2184,
						longitude: -1.5536,
					},
					radiusKm: 30,
				},
				{
					kind: "geoRadius",
					key: "near",
					label: "Around",
					searchPlaces: async () => [],
				},
			),
		).toBe("Around: 30 km around Nantes");
	});

	it("returns null for a filter the screen no longer declares", () => {
		expect(
			describeFilterValue({
				definition: undefined,
				value: { kind: "text", text: "camille" },
				labels: defaultFilterLabels,
				locale: "en-US",
			}),
		).toBeNull();
	});
});
