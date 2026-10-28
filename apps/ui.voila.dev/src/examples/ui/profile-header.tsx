import { Badge } from "@voila.dev/ui/badge";
import { Button } from "@voila.dev/ui/button";
import { ProfileHeader } from "@voila.dev/ui/profile-header";

export function Default() {
	return (
		<ProfileHeader.Root
			className="w-full rounded-xl border"
			name="Camille Dubois"
			headline="Freelance product designer"
			theme="brand"
			avatar={{ src: "https://github.com/shadcn.png", name: "Camille Dubois" }}
			badges={
				<>
					<Badge variant="brand">Identity verified</Badge>
					<Badge variant="secondary">Product design</Badge>
				</>
			}
			actions={<Button size="sm">Contact</Button>}
		/>
	);
}
