import { Button as ButtonPrimitive } from "@base-ui/react/button";

import {
	type ButtonVariants,
	buttonVariants,
} from "#/components/ui/button-variants.ts";
import { Spinner } from "#/components/ui/spinner.tsx";
import { cn } from "#/lib/utils.ts";

type ButtonProps = ButtonPrimitive.Props &
	ButtonVariants & {
		/**
		 * Show a leading spinner and mark the button `aria-busy`, disabling
		 * interaction while an async action is in flight (e.g. a form submit).
		 */
		loading?: boolean;
	};

function Button({
	className,
	variant = "default",
	size = "default",
	shape = "default",
	loading = false,
	disabled,
	children,
	...props
}: ButtonProps) {
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

export {
	type ButtonSize,
	type ButtonVariant,
	type ButtonVariants,
	buttonSizeOptions,
	buttonVariantOptions,
	buttonVariants,
} from "#/components/ui/button-variants.ts";
export { Button, type ButtonProps };
