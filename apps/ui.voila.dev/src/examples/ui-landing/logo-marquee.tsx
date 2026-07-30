import { LogoMarquee } from "@voila.dev/ui/landing";
import { partnerLogoDataUri } from "./fixtures";

const partnerNames = ["Northwind", "Globex", "Initech", "Contoso"];

export function LogoMarqueeExample() {
	return (
		<LogoMarquee.Root>
			<LogoMarquee.Title>Trusted by teams at</LogoMarquee.Title>
			<LogoMarquee.Viewport>
				<LogoMarquee.Track>
					{partnerNames.map((name) => (
						<LogoMarquee.Item
							key={name}
							src={partnerLogoDataUri(name)}
							alt={name}
						/>
					))}
				</LogoMarquee.Track>
			</LogoMarquee.Viewport>
		</LogoMarquee.Root>
	);
}

export function LogoMarqueeStatic() {
	return (
		<LogoMarquee.Root>
			<LogoMarquee.Title>Reference brands</LogoMarquee.Title>
			<LogoMarquee.StaticTrack>
				{partnerNames.map((name) => (
					<LogoMarquee.Item
						key={name}
						src={partnerLogoDataUri(name)}
						alt={name}
					/>
				))}
			</LogoMarquee.StaticTrack>
		</LogoMarquee.Root>
	);
}
