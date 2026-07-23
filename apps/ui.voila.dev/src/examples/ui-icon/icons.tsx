import { Icon } from "@voila.dev/ui-icon/components/icon";

export function Default() {
	return (
		<>
			<Icon name="HeartbeatIcon" className="size-6" />
			<Icon name="StethoscopeIcon" className="size-6" />
			<Icon name="FirstAidKitIcon" className="size-6" />
			<Icon name="TrophyIcon" className="size-6" />
		</>
	);
}

export function Weights() {
	return (
		<>
			<Icon name="HeartbeatIcon" weight="thin" className="size-6" />
			<Icon name="HeartbeatIcon" weight="regular" className="size-6" />
			<Icon name="HeartbeatIcon" weight="bold" className="size-6" />
			<Icon name="HeartbeatIcon" weight="fill" className="size-6" />
			<Icon name="HeartbeatIcon" weight="duotone" className="size-6" />
		</>
	);
}

export function FromData() {
	const categories = [
		{ name: "Kinésithérapie", icon: "HeartbeatIcon", color: "text-provider" },
		{ name: "Médecine", icon: "StethoscopeIcon", color: "text-organization" },
		{ name: "Urgences", icon: "FirstAidKitIcon", color: "text-destructive" },
		{ name: "Inconnue", icon: "NotAnIconName", color: "text-muted-foreground" },
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
