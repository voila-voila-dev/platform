import { CheckIcon, WarningIcon } from "@phosphor-icons/react";
import { Badge, badgeColors } from "@voila.dev/ui/badge";

export function Default() {
	return <Badge>Verified</Badge>;
}

export function Variants() {
	return (
		<>
			<Badge>Default</Badge>
			<Badge variant="secondary">Secondary</Badge>
			<Badge variant="outline">Outline</Badge>
			<Badge variant="destructive">Destructive</Badge>
			<Badge variant="ghost">Ghost</Badge>
			<Badge variant="link">Link</Badge>
		</>
	);
}

export function SurfaceVariants() {
	return (
		<>
			<Badge variant="brand">Freelancer</Badge>
			<Badge variant="highlight">Client</Badge>
		</>
	);
}

export function Sizes() {
	return (
		<>
			<Badge size="default">Default</Badge>
			<Badge size="sm">Small</Badge>
		</>
	);
}

export function Colors() {
	return (
		<>
			{badgeColors.map((color) => (
				<Badge key={color} color={color}>
					{color}
				</Badge>
			))}
		</>
	);
}

export function WithIcons() {
	return (
		<>
			<Badge>
				<CheckIcon /> Verified
			</Badge>
			<Badge variant="destructive">
				<WarningIcon /> Expired
			</Badge>
		</>
	);
}

export function AsLink() {
	return (
		<>
			<Badge render={<a href="https://ui.voila.dev">Docs</a>} />
			<Badge
				variant="outline"
				render={<a href="https://ui.voila.dev">Changelog</a>}
			/>
		</>
	);
}
