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
