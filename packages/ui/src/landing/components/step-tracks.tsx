import { createContext, useContext } from "react";
import {
	type Tone,
	toneConnectorLineClass,
	toneHoverBorderClass,
	toneSolidClass,
	toneTextClass,
	toneTintBackgroundClass,
} from "#/landing/lib/tones.ts";
import { cn } from "#/lib/utils.ts";

/**
 * Parallel tone-colored step tracks with a vertical connector line and
 * numbered icon tiles. Compose: Root > Track (tone) >
 * Header (HeaderIcon + HeaderText > HeaderTitle/HeaderSubtitle) +
 * Steps > Step (StepIcon number + Body > BodyTitle/BodyDescription).
 */

const StepTracksToneContext = createContext<Tone>("primary");

function Root({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="step-tracks"
			className={cn("grid gap-16 lg:grid-cols-2 lg:gap-12", className)}
			{...props}
		/>
	);
}

interface StepTracksTrackProps extends React.ComponentProps<"div"> {
	tone?: Tone;
}

function Track({
	tone = "primary",
	className,
	...props
}: StepTracksTrackProps) {
	return (
		<StepTracksToneContext.Provider value={tone}>
			<div
				data-slot="step-tracks-track"
				className={cn("animate-fade-up", className)}
				{...props}
			/>
		</StepTracksToneContext.Provider>
	);
}

function Header({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="step-tracks-header"
			className={cn("mb-8 flex items-center gap-4", className)}
			{...props}
		/>
	);
}

function HeaderIcon({ className, ...props }: React.ComponentProps<"div">) {
	const tone = useContext(StepTracksToneContext);

	return (
		<div
			data-slot="step-tracks-header-icon"
			className={cn(
				"flex h-12 w-12 shrink-0 items-center justify-center rounded-xl [&_svg]:h-6 [&_svg]:w-6",
				toneTintBackgroundClass[tone],
				toneTextClass[tone],
				className,
			)}
			{...props}
		/>
	);
}

function HeaderText({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div data-slot="step-tracks-header-text" className={className} {...props} />
	);
}

function HeaderTitle({ className, ...props }: React.ComponentProps<"h3">) {
	const tone = useContext(StepTracksToneContext);

	return (
		<h3
			data-slot="step-tracks-header-title"
			className={cn("text-xl font-semibold", toneTextClass[tone], className)}
			{...props}
		/>
	);
}

function HeaderSubtitle({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="step-tracks-header-subtitle"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

/** Stepper wrapper — owns the vertical connector line behind the icon tiles. */
function Steps({ className, children, ...props }: React.ComponentProps<"div">) {
	const tone = useContext(StepTracksToneContext);

	return (
		<div
			data-slot="step-tracks-steps"
			className={cn("relative", className)}
			{...props}
		>
			<div
				className={cn(
					"absolute bottom-10 left-7 top-2 w-px",
					toneConnectorLineClass[tone],
				)}
			/>
			<div className="grid gap-6">{children}</div>
		</div>
	);
}

function Step({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="step-tracks-step"
			className={cn("animate-fade-up relative flex gap-5", className)}
			{...props}
		/>
	);
}

interface StepTracksStepIconProps extends React.ComponentProps<"div"> {
	number: number;
}

function StepIcon({
	number,
	className,
	children,
	...props
}: StepTracksStepIconProps) {
	const tone = useContext(StepTracksToneContext);

	return (
		<div
			data-slot="step-tracks-step-icon"
			className={cn(
				"relative z-10 h-14 w-14 shrink-0 rounded-xl bg-background",
				className,
			)}
			{...props}
		>
			<div
				className={cn(
					"flex h-full w-full items-center justify-center rounded-xl [&_svg]:h-6 [&_svg]:w-6",
					toneTintBackgroundClass[tone],
					toneTextClass[tone],
				)}
			>
				{children}
			</div>
			<span
				className={cn(
					"absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
					toneSolidClass[tone],
				)}
			>
				{number}
			</span>
		</div>
	);
}

function Body({ className, ...props }: React.ComponentProps<"div">) {
	const tone = useContext(StepTracksToneContext);

	return (
		<div
			data-slot="step-tracks-step-body"
			className={cn(
				"flex-1 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md",
				toneHoverBorderClass[tone],
				className,
			)}
			{...props}
		/>
	);
}

function BodyTitle({ className, ...props }: React.ComponentProps<"h4">) {
	return (
		<h4
			data-slot="step-tracks-step-title"
			className={cn("mb-2 text-lg font-semibold", className)}
			{...props}
		/>
	);
}

function BodyDescription({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="step-tracks-step-description"
			className={cn(
				"text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground",
				className,
			)}
			{...props}
		/>
	);
}

export const StepTracks = {
	Root,
	Track,
	Header,
	HeaderIcon,
	HeaderText,
	HeaderTitle,
	HeaderSubtitle,
	Steps,
	Step,
	StepIcon,
	Body,
	BodyTitle,
	BodyDescription,
};

export type { StepTracksStepIconProps, StepTracksTrackProps };
