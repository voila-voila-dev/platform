import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { Container } from "#/landing/components/container.tsx";
import { cn } from "#/lib/utils.ts";

/**
 * Partner/brand logo band, either an animated marquee or a static wrap. The
 * marquee keyframes live in `@voila.dev/ui/landing/landing.css`.
 */

function Root({ className, children, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="logo-marquee"
			className={cn("border-y border-border bg-muted/30 py-8", className)}
			{...props}
		>
			<Container>{children}</Container>
		</div>
	);
}

function Title({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="logo-marquee-title"
			className={cn(
				"mb-6 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}

/** Clips the track and fades its cut-off edges into the band background. */
function Viewport({
	className,
	children,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="logo-marquee-viewport"
			className={cn("relative overflow-hidden", className)}
			{...props}
		>
			<div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-linear-to-r from-muted/30 to-transparent" />
			<div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-linear-to-l from-muted/30 to-transparent" />
			{children}
		</div>
	);
}

interface LogoMarqueeTrackProps extends React.ComponentProps<"div"> {
	/** Seconds for one loop of the marquee. */
	duration?: number;
}

/**
 * Auto-scrolling track. Children are rendered twice (second pass
 * `aria-hidden`, laid out flat via `display: contents`) so the -50%
 * translation loops seamlessly. Pauses on hover.
 */
function Track({
	duration = 30,
	className,
	style,
	children,
	...props
}: LogoMarqueeTrackProps) {
	return (
		<div
			data-slot="logo-marquee-track"
			className={cn(
				"flex animate-[landing-marquee_30s_linear_infinite] items-center gap-12 hover:[animation-play-state:paused]",
				className,
			)}
			style={{ animationDuration: `${duration}s`, ...style }}
			{...props}
		>
			{children}
			<div aria-hidden="true" className="contents">
				{children}
			</div>
		</div>
	);
}

/** Non-animated alternative: centered wrapping row of logos. */
function StaticTrack({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="logo-marquee-static-track"
			className={cn(
				"flex flex-wrap items-center justify-center gap-12",
				className,
			)}
			{...props}
		/>
	);
}

/** One logo — renders an `img` by default; pass `render` for custom markup. */
function Item({
	className,
	render,
	...props
}: useRender.ComponentProps<"img">) {
	return useRender({
		defaultTagName: "img",
		props: mergeProps<"img">(
			{
				className: cn(
					"h-12 w-auto shrink-0 object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0",
					className,
				),
				loading: "lazy",
			},
			props,
		),
		render,
		state: {
			slot: "logo-marquee-item",
		},
	});
}

export const LogoMarquee = {
	Root,
	Title,
	Viewport,
	Track,
	StaticTrack,
	Item,
};

export type { LogoMarqueeTrackProps };
