import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { Button } from "#/button/components/button.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends useRender.ComponentProps<"div"> {
	/** Text of the built-in dismiss button. Omit the prop to render no dismiss at all. */
	closeLabel?: string;
}

export function DialogFooter({
	className,
	closeLabel,
	children,
	render,
	...props
}: Props) {
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					"-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
					className,
				),
				children: (
					<>
						{closeLabel !== undefined && (
							<DialogPrimitive.Close
								data-slot="dialog-footer-close"
								render={<Button variant="outline" />}
							>
								{closeLabel}
							</DialogPrimitive.Close>
						)}
						{children}
					</>
				),
			},
			props,
		),
		render,
		state: { slot: "dialog-footer" },
	});
}
