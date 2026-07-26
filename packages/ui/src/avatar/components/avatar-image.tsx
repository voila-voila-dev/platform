import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cn } from "#/lib/utils.ts";

interface Props extends AvatarPrimitive.Image.Props {}

export function AvatarImage({ className, ...props }: Props) {
	return (
		<AvatarPrimitive.Image
			data-slot="avatar-image"
			className={cn(
				"aspect-square size-full animate-in rounded-full object-cover duration-300 fade-in",
				className,
			)}
			{...props}
		/>
	);
}
