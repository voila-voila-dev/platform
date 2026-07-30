import { AspectRatio } from "@voila.dev/ui/aspect-ratio";

const coverImage = `data:image/svg+xml;utf8,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="384" height="160"><rect width="384" height="160" fill="#7c3aed"/><text x="50%" y="50%" fill="white" font-family="sans-serif" font-size="20" text-anchor="middle" dy=".3em">Launch day</text></svg>',
)}`;

/* -------------------------------------------------------------------------- */
/* Card                                                                       */
/* -------------------------------------------------------------------------- */

export function AspectRatioExample() {
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
