import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { isValidElement } from "react";
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

/**
 * Base UI assumes `render` produces a `<button>` and warns when it doesn't,
 * because a non-button needs the keyboard and role handling it would otherwise
 * skip. `render={<a href>}` spells the answer out, so read it rather than
 * making every caller repeat `nativeButton={false}`. A component element says
 * nothing about the tag it returns, so there the caller still decides.
 */
function rendersNativeButton(render: Props["render"]) {
	if (!isValidElement(render)) return undefined;
	if (typeof render.type !== "string") return undefined;
	return render.type === "button";
}

export function Button({
	className,
	variant = "default",
	size = "default",
	shape = "default",
	loading = false,
	disabled,
	nativeButton,
	render,
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
			nativeButton={nativeButton ?? rendersNativeButton(render)}
			render={render}
			className={cn(buttonVariants({ variant, size, shape }), className)}
			{...props}
		>
			{loading ? <Spinner /> : null}
			{children}
		</ButtonPrimitive>
	);
}
