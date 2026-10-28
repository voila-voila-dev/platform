import { Context } from "effect";
import type { Locale } from "#locale/value-objects/locale";
import {
	type AddressFormat,
	renderAddressFormat,
} from "#location/lib/address-format";
import { countryName } from "#location/lib/country-names";
import { ADDRESS_FORMAT_DATA } from "#location/lib/generated/address-format-data";
import type { Address } from "#location/value-objects/address";
import type { CountryCode } from "#location/value-objects/country-code";

const FALLBACK_FORMAT: AddressFormat = { template: "%A%n%Z %C" };

// A country's own way, when its template is not enough.
export type AddressLinesFormatter = (address: Address) => ReadonlyArray<string>;

export interface AddressFormatterConfig {
	readonly formats?: Partial<
		Record<CountryCode, AddressFormat | AddressLinesFormatter>
	>;
}

export interface AddressLinesOptions {
	// The language the country line is written in.
	readonly locale: Locale;
	// The sender's country: mail within one country carries no country line.
	readonly from?: CountryCode;
}

function make(config: AddressFormatterConfig = {}) {
	function formatFor(country: CountryCode) {
		return (
			config.formats?.[country] ??
			ADDRESS_FORMAT_DATA[country] ??
			FALLBACK_FORMAT
		);
	}

	function lines(
		address: Address,
		options: AddressLinesOptions,
	): ReadonlyArray<string> {
		const format = formatFor(address.country);
		const addressLines =
			typeof format === "function"
				? format(address)
				: renderAddressFormat(format, address);
		return options.from === address.country
			? addressLines
			: [...addressLines, countryName(address.country, options.locale)];
	}

	return {
		lines,
		text: (address: Address, options: AddressLinesOptions) =>
			lines(address, options).join("\n"),
		singleLine: (address: Address, options: AddressLinesOptions) =>
			lines(address, options).join(", "),
	};
}

export type AddressFormatterShape = ReturnType<typeof make>;

// Every country's postal format by default; an app overrides some with `AddressFormatter.make({ formats })`.
export class AddressFormatter extends Context.Reference<AddressFormatterShape>(
	"@voila.dev/platform/AddressFormatter",
	{ defaultValue: () => make() },
) {
	static readonly make = make;
}
