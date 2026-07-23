import type {
	BooleanFilterValue,
	DateRangeFilterValue,
	FilterDefinition,
	FilterLabels,
	FilterValue,
	FilterValues,
	MoneyRangeFilterValue,
	NumberRangeFilterValue,
	SelectFilterValue,
} from "#/types.ts";

/**
 * Is this value worth keeping? An "empty" value (blank text, no selection, both
 * range bounds missing) is indistinguishable from no filter at all, so the
 * record drops it — that keeps the active count, the chips and the query in
 * agreement without every caller re-deriving emptiness.
 */
export function isFilterValueEmpty(value: FilterValue): boolean {
	switch (value.kind) {
		case "text":
			return value.text.trim() === "";
		case "number":
			return Number.isNaN(value.number);
		case "numberRange":
		case "moneyRange":
			return value.min === undefined && value.max === undefined;
		case "select":
			return value.values.length === 0;
		case "dateRange":
			return value.from === undefined && value.to === undefined;
		case "geoRadius":
			return false;
		case "boolean":
			return false;
	}
}

/** Set (or clear, when empty) one filter, returning a new record. */
export function setFilterValue(
	values: FilterValues,
	key: string,
	value: FilterValue | undefined,
): FilterValues {
	const next = { ...values };
	if (value === undefined || isFilterValueEmpty(value)) {
		delete next[key];
	} else {
		next[key] = value;
	}
	return next;
}

/** Drop one filter, returning a new record. */
export function clearFilterValue(
	values: FilterValues,
	key: string,
): FilterValues {
	return setFilterValue(values, key, undefined);
}

/** How many filters are set — the badge on the trigger. */
export function countActiveFilters(values: FilterValues): number {
	return Object.keys(values).length;
}

const formatNumber = (value: number, locale: string): string =>
	new Intl.NumberFormat(locale).format(value);

const formatMoney = (
	minorUnits: number,
	currency: string,
	locale: string,
): string =>
	new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
		maximumFractionDigits: minorUnits % 100 === 0 ? 0 : 2,
	}).format(minorUnits / 100);

const formatDate = (isoDate: string, locale: string): string => {
	const parsed = new Date(`${isoDate}T00:00:00`);
	return Number.isNaN(parsed.getTime())
		? isoDate
		: new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(parsed);
};

/** `10 – 20`, `≥ 10`, `≤ 20` — the shape every range chip reads in. */
function describeBounds(
	min: string | undefined,
	max: string | undefined,
): string {
	if (min !== undefined && max !== undefined) return `${min} – ${max}`;
	if (min !== undefined) return `≥ ${min}`;
	if (max !== undefined) return `≤ ${max}`;
	return "";
}

/** What every describer needs beyond the value itself. */
type DescribeContext = {
	readonly definition: FilterDefinition;
	readonly labels: FilterLabels;
	readonly locale: string;
};

const operatorOf = (
	excluded: boolean | undefined,
	{ labels }: DescribeContext,
): string => (excluded === true ? labels.isNot : labels.is);

/** A value kind can outlive the definition it was written against (a stale URL). */
const unitOf = ({ definition }: DescribeContext): string =>
	(definition.kind === "number" || definition.kind === "numberRange") &&
	definition.unit !== undefined
		? ` ${definition.unit}`
		: "";

function describeNumberRange(
	value: NumberRangeFilterValue,
	context: DescribeContext,
): string {
	const unit = unitOf(context);
	const format = (bound: number | undefined) =>
		bound === undefined
			? undefined
			: `${formatNumber(bound, context.locale)}${unit}`;
	return describeBounds(format(value.min), format(value.max));
}

function describeMoneyRange(
	value: MoneyRangeFilterValue,
	{ definition, locale }: DescribeContext,
): string {
	const currency =
		definition.kind === "moneyRange" ? definition.currency : "EUR";
	const format = (bound: number | undefined) =>
		bound === undefined ? undefined : formatMoney(bound, currency, locale);
	return describeBounds(format(value.min), format(value.max));
}

function describeSelect(
	value: SelectFilterValue,
	context: DescribeContext,
): string {
	const { definition, labels } = context;
	const options = definition.kind === "select" ? definition.options : [];
	const labelOf = (optionValue: string) =>
		options.find((option) => option.value === optionValue)?.label ??
		optionValue;
	// Beyond two selections the chip states the count: a chip is a summary, not
	// a list, and the panel is one tap away for the detail.
	const rendered =
		value.values.length > 2
			? labels.selectedCount(value.values.length)
			: value.values.map(labelOf).join(", ");
	return `${definition.label} ${operatorOf(value.excluded, context)} ${rendered}`;
}

function describeBoolean(
	value: BooleanFilterValue,
	{ definition }: DescribeContext,
): string {
	if (definition.kind !== "boolean") return String(value.value);
	return value.value ? definition.trueLabel : definition.falseLabel;
}

function describeDateRange(
	value: DateRangeFilterValue,
	{ locale }: DescribeContext,
): string {
	const format = (bound: string | undefined) =>
		bound === undefined ? undefined : formatDate(bound, locale);
	return describeBounds(format(value.from), format(value.to));
}

/**
 * The human sentence for one active filter, as shown on its chip: the label,
 * the operator when the filter is inverted, and the value in the reader's
 * locale. Returns `null` for a value that has no definition anymore (a filter
 * removed from the screen but still in a bookmarked URL).
 */
export function describeFilterValue({
	definition,
	value,
	labels,
	locale,
}: {
	definition: FilterDefinition | undefined;
	value: FilterValue;
	labels: FilterLabels;
	locale: string;
}): string | null {
	if (definition === undefined) return null;
	const context: DescribeContext = { definition, labels, locale };
	const labelled = (rendered: string) => `${definition.label}: ${rendered}`;

	switch (value.kind) {
		case "text":
			return `${definition.label} ${operatorOf(value.excluded, context)} ${value.text}`;
		case "number":
			return labelled(
				`${formatNumber(value.number, locale)}${unitOf(context)}`,
			);
		case "numberRange":
			return labelled(describeNumberRange(value, context));
		case "moneyRange":
			return labelled(describeMoneyRange(value, context));
		case "select":
			return describeSelect(value, context);
		case "dateRange":
			return labelled(describeDateRange(value, context));
		case "geoRadius":
			return labelled(labels.around(value.place.label, value.radiusKm));
		case "boolean":
			return labelled(describeBoolean(value, context));
	}
}
