import { isIP } from "node:net";

interface OctetRange {
	readonly first: readonly [number, number];
	readonly second: readonly [number, number];
}

// Unconstrained rather than [0, 255]: an octet is only range-checked when the
// range narrows it, so an out-of-range octet can never miss a range and be
// treated as public.
const ANY_OCTET: readonly [number, number] = [
	Number.NEGATIVE_INFINITY,
	Number.POSITIVE_INFINITY,
];

/** Inclusive first/second-octet bounds of every IPv4 range refused. */
const PRIVATE_IPV4_RANGES: ReadonlyArray<OctetRange> = [
	{ first: [0, 0], second: ANY_OCTET }, // "this" network
	{ first: [10, 10], second: ANY_OCTET }, // private
	{ first: [127, 127], second: ANY_OCTET }, // loopback
	{ first: [100, 100], second: [64, 127] }, // CGNAT
	{ first: [169, 169], second: [254, 254] }, // link-local / cloud metadata
	{ first: [172, 172], second: [16, 31] }, // private
	{ first: [192, 192], second: [168, 168] }, // private
	{ first: [192, 192], second: [0, 0] }, // IETF protocol assignments
	{ first: [198, 198], second: [18, 19] }, // benchmarking
	{ first: [224, Number.POSITIVE_INFINITY], second: ANY_OCTET }, // multicast + reserved + broadcast
];

function isWithin(value: number, [low, high]: readonly [number, number]) {
	return value >= low && value <= high;
}

function isPrivateIpv4(address: string): boolean {
	const octets = address.split(".").map(Number);
	if (octets.length !== 4 || octets.some((octet) => Number.isNaN(octet))) {
		return true;
	}
	const [first = Number.NaN, second = Number.NaN] = octets;
	return PRIVATE_IPV4_RANGES.some(
		(range) => isWithin(first, range.first) && isWithin(second, range.second),
	);
}

/** The first two groups of an IPv6 address, `::` expanded. */
function leadingGroups(address: string): readonly [number, number] {
	const [head = "", tail] = address.split("::");
	const groups = head === "" ? [] : head.split(":");
	const padded =
		tail === undefined
			? groups
			: [...groups, ...Array.from({ length: 8 }, () => "0")];
	return [
		Number.parseInt(padded[0] ?? "0", 16),
		Number.parseInt(padded[1] ?? "0", 16),
	];
}

// Inside global unicast, the ranges that carry or reach an IPv4 address (6to4, Teredo), the protocol assignments and documentation: [first group, second group from, to].
const NON_PUBLIC_GLOBAL_RANGES: ReadonlyArray<
	readonly [number, number, number]
> = [
	[0x20_02, 0x00_00, 0xff_ff],
	[0x20_01, 0x00_00, 0x01_ff],
	[0x20_01, 0x0d_b8, 0x0d_b8],
	[0x3f_ff, 0x00_00, 0x0f_ff],
];

// Public means global unicast (2000::/3) outside the prefixes above; every
// other range (loopback, link-local, unique-local, multicast, NAT64, the
// IPv4-mapped forms) is refused. A dotted IPv4-mapped address is judged by its
// IPv4 address.
function isPrivateIpv6(address: string): boolean {
	const normalized = address.toLowerCase();
	const mapped = normalized.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/u);
	if (mapped?.[1] !== undefined) {
		return isPrivateIpv4(mapped[1]);
	}
	const [first, second] = leadingGroups(normalized);
	const globalUnicast = first >= 0x20_00 && first <= 0x3f_ff;
	return (
		!globalUnicast ||
		NON_PUBLIC_GLOBAL_RANGES.some(
			([rangeFirst, secondFrom, secondTo]) =>
				first === rangeFirst && second >= secondFrom && second <= secondTo,
		)
	);
}

/**
 * True for any address a server-side fetch of a user's URL must not reach:
 * loopback, private, link-local (cloud metadata), reserved. Anything that is
 * not an IP address at all counts as private, so a parsing gap fails closed.
 */
export function isPrivateAddress(address: string): boolean {
	const family = isIP(address);
	if (family === 4) return isPrivateIpv4(address);
	if (family === 6) return isPrivateIpv6(address);
	return true;
}
