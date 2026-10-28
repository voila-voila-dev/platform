import type { Address } from "#location/value-objects/address";

// libaddressinput's notation: %A street, %C city, %Z postal code, %n a new line.
export interface AddressFormat {
	readonly template: string;
	// For an address written in Latin script, in countries whose own order differs (Japan, China…).
	readonly latinTemplate?: string;
	// The fields the country's post wants in capitals, as letters: "C" for the city.
	readonly uppercase?: string;
}

const NON_LATIN = /[^\p{Script=Latin}\p{Script=Common}\p{Script=Inherited}]/u;

function isLatin(address: Address) {
	return !NON_LATIN.test(
		`${address.street}${address.city}${address.postalCode}`,
	);
}

export function renderAddressFormat(
	format: AddressFormat,
	address: Address,
): ReadonlyArray<string> {
	const template =
		format.latinTemplate !== undefined && isLatin(address)
			? format.latinTemplate
			: format.template;
	const uppercase = format.uppercase ?? "";
	function field(letter: string, value: string) {
		return uppercase.includes(letter) ? value.toUpperCase() : value;
	}
	const values: Readonly<Record<string, string>> = {
		A: field("A", address.street),
		C: field("C", address.city),
		Z: field("Z", address.postalCode),
	};
	return template
		.split("%n")
		.map((line) =>
			line
				.replace(/%([A-Za-z])/gu, (_, letter: string) => values[letter] ?? "")
				.trim(),
		)
		.filter((line) => line.length > 0);
}
