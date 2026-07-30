import { UserAvatar } from "@voila.dev/ui/user-avatar";

export function UserAvatarExample() {
	return (
		<div className="flex flex-col items-start gap-4">
			<UserAvatar
				name="Camille Dubois"
				description="Freelance product designer"
				src="https://github.com/shadcn.png"
				status="online"
			/>
			<UserAvatar name="Nathan Guyot" description="Developer" size="sm" />
			<UserAvatar name="Marie Lefevre" size="lg" />
		</div>
	);
}
