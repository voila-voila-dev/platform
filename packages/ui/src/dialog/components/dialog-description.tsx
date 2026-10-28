import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "#/lib/utils.ts";

interface Props extends DialogPrimitive.Description.Props {}

export function DialogDescription({ className, ...props }: Props) {
	return (
		<DialogPrimitive.Description
			data-slot="dialog-description"
			className={cn(
				"text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-foreground",
				className,
			)}
			{...props}
		/>
	);
}
