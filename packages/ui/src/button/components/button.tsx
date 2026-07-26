import { Button as ButtonPrimitive } from "@base-ui/react/button";
import {
	type ButtonVariants,
	buttonVariants,
} from "#/button/components/button-variants.ts";
import { cn } from "#/lib/utils.ts";
import { Spinner } from "#/spinner/components/spinner.tsx";

interface Props extends ButtonPrimitive.Props, ButtonVariants {
	/**
	 * Show a leading spinner and mark the button `aria-busy`, disabling
	 * interaction while an async action is in flight (e.g. a form submit).
	 */
	loading?: boolean;
}

export function Button({
	className,
	variant = "default",
	size = "default",
	shape = "default",
	loading = false,
	disabled,
	children,
	...props
}: Props) {
	return (
		<ButtonPrimitive
			data-slot="button"
			data-variant={variant}
			data-size={size}
			data-shape={shape}
			disabled={disabled || loading}
			aria-busy={loading || undefined}
			className={cn(buttonVariants({ variant, size, shape }), className)}
			{...props}
		>
			{loading ? <Spinner /> : null}
			{children}
		</ButtonPrimitive>
	);
}
