import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cn } from "#/lib/utils.ts";

interface Props extends AvatarPrimitive.Fallback.Props {}

export function AvatarFallback({ className, ...props }: Props) {
	return (
		<AvatarPrimitive.Fallback
			data-slot="avatar-fallback"
			className={cn(
				"flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=lg]/avatar:text-base group-data-[size=sm]/avatar:text-xs",
				className,
			)}
			{...props}
		/>
	);
}
