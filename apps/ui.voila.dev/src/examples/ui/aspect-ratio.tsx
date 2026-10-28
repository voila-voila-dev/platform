import { AspectRatio } from "@voila.dev/ui/aspect-ratio";

const coverImage = `data:image/svg+xml;utf8,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="384" height="160"><rect width="384" height="160" fill="#7c3aed"/><text x="50%" y="50%" fill="white" font-family="sans-serif" font-size="20" text-anchor="middle" dy=".3em">Launch day</text></svg>',
)}`;

/* -------------------------------------------------------------------------- */
/* Card                                                                       */
/* -------------------------------------------------------------------------- */

export function Default() {
	return (
		<div className="w-full max-w-96">
			<AspectRatio ratio={16 / 9}>
				<img
					src={coverImage}
					alt="Launch day cover"
					className="size-full rounded-lg object-cover"
				/>
			</AspectRatio>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Ratios                                                                     */
/* -------------------------------------------------------------------------- */

export function Ratios() {
	return (
		<div className="grid w-full max-w-lg grid-cols-3 gap-3">
			{[
				{ label: "1", ratio: 1 as const },
				{ label: "3/4", ratio: "3/4" as const },
				{ label: "16 / 9", ratio: 16 / 9 },
			].map(({ label, ratio }) => (
				<AspectRatio key={label} ratio={ratio}>
					<div className="flex size-full items-center justify-center rounded-lg bg-muted font-medium text-muted-foreground text-sm">
						{label}
					</div>
				</AspectRatio>
			))}
		</div>
	);
}
