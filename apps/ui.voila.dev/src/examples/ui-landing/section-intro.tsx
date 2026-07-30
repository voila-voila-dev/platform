import {
	Eyebrow as EyebrowParts,
	SectionIntro as SectionIntroParts,
} from "@voila.dev/ui/landing";

export function SectionIntro() {
	return (
		<SectionIntroParts.Root>
			<EyebrowParts.Root tone="primary" className="mb-4">
				<EyebrowParts.Label>How it works</EyebrowParts.Label>
			</EyebrowParts.Root>
			<SectionIntroParts.Title>
				Two journeys, one <span className="text-primary">match</span>
			</SectionIntroParts.Title>
			<SectionIntroParts.Description>
				Staff your project as a client, find your next engagement as a
				freelancer: three steps are enough.
			</SectionIntroParts.Description>
		</SectionIntroParts.Root>
	);
}
