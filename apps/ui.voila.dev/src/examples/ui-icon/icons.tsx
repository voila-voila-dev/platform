import { Icon } from "@voila.dev/ui-icon/components/icon";

export function Default() {
	return (
		<>
			<Icon name="PaletteIcon" className="size-6" />
			<Icon name="CodeIcon" className="size-6" />
			<Icon name="PenNibIcon" className="size-6" />
			<Icon name="TrophyIcon" className="size-6" />
		</>
	);
}

export function Weights() {
	return (
		<>
			<Icon name="PaletteIcon" weight="thin" className="size-6" />
			<Icon name="PaletteIcon" weight="regular" className="size-6" />
			<Icon name="PaletteIcon" weight="bold" className="size-6" />
			<Icon name="PaletteIcon" weight="fill" className="size-6" />
			<Icon name="PaletteIcon" weight="duotone" className="size-6" />
		</>
	);
}

export function FromData() {
	const categories = [
		{ name: "Design", icon: "PaletteIcon", color: "text-brand" },
		{ name: "Development", icon: "CodeIcon", color: "text-highlight" },
		{ name: "Overdue", icon: "WarningIcon", color: "text-destructive" },
		{ name: "Unknown", icon: "NotAnIconName", color: "text-muted-foreground" },
	];
	return (
		<div className="flex flex-col gap-2">
			{categories.map((category) => (
				<div key={category.name} className="flex items-center gap-2 text-sm">
					<Icon name={category.icon} className={`size-5 ${category.color}`} />
					{category.name}
				</div>
			))}
		</div>
	);
}
