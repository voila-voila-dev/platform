import { Heading, type HeadingProps } from "#/landing/components/heading.tsx";
import { Text, type TextProps } from "#/landing/components/text.tsx";
import { cn } from "#/lib/utils.ts";

/**
 * Bordered contact cards (email/phone). Compose: Root > Card > CardTitle +
 * CardDescription + an action (e.g. a `@voila.dev/ui` Button rendered as a
 * `mailto:`/`tel:` anchor).
 */

function Root({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="contact-cards"
			className={cn("grid gap-8 md:grid-cols-2", className)}
			{...props}
		/>
	);
}

function Card({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="contact-card"
			className={cn("rounded-2xl border border-border p-8", className)}
			{...props}
		/>
	);
}

function CardTitle({ className, ...props }: HeadingProps) {
	return (
		<Heading level="h2" className={cn("mb-2 text-xl", className)} {...props} />
	);
}

function CardDescription({ className, ...props }: TextProps) {
	return (
		<Text className={cn("mb-4 text-muted-foreground", className)} {...props} />
	);
}

export const ContactCards = {
	Root,
	Card,
	CardTitle,
	CardDescription,
};
