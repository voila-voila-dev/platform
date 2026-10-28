/** The default WebGL-less fallback: a static globe outline in `--muted`. */
export function StaticGlobeOutline() {
	return (
		<svg
			aria-hidden
			viewBox="0 0 100 100"
			className="mx-auto aspect-square h-full max-w-full text-muted"
		>
			<title>Globe unavailable</title>
			<circle
				cx="50"
				cy="50"
				r="48"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<ellipse
				cx="50"
				cy="50"
				rx="24"
				ry="48"
				fill="none"
				stroke="currentColor"
			/>
			<ellipse
				cx="50"
				cy="50"
				rx="44"
				ry="48"
				fill="none"
				stroke="currentColor"
				strokeWidth="0.5"
			/>
			<line x1="2" y1="50" x2="98" y2="50" stroke="currentColor" />
			<path d="M 7 26 A 60 60 0 0 1 93 26" fill="none" stroke="currentColor" />
			<path d="M 7 74 A 60 60 0 0 0 93 74" fill="none" stroke="currentColor" />
		</svg>
	);
}
