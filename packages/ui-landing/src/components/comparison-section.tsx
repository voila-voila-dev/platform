import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";
import { cn } from "@voila.dev/ui/lib/utils";
import { createContext, useContext } from "react";

import { Container } from "#/components/container.tsx";
import { Section, type SectionProps } from "#/components/section.tsx";
import { type Tone, tonePanelClass, toneTextClass } from "#/lib/tones.ts";

/**
 * Before/after benefits split (crossed-out list vs checked list + tag chips +
 * illustration).
 * Compose: Root (tone) > Content (Eyebrow, Heading, Panels > Panel >
 * PanelTitle + PanelList > PanelItem, TagList > Tag, actions) + Media.
 */

const ComparisonToneContext = createContext<Tone>("primary");

type ComparisonPanelVariant = "without" | "with";

const ComparisonPanelContext = createContext<ComparisonPanelVariant>("with");

interface ComparisonSectionRootProps extends SectionProps {
	tone?: Tone;
}

function Root({
	tone = "primary",
	spacing = "lg",
	background,
	className,
	children,
	...props
}: ComparisonSectionRootProps) {
	return (
		<ComparisonToneContext.Provider value={tone}>
			{/* overflow-hidden: the Media illustrations carry decorative blur blobs
			    that would otherwise create a few pixels of horizontal scroll. */}
			<Section
				spacing={spacing}
				background={background}
				className={cn("overflow-hidden", className)}
				{...props}
			>
				<Container>
					<div className="grid items-center gap-12 lg:grid-cols-2">
						{children}
					</div>
				</Container>
			</Section>
		</ComparisonToneContext.Provider>
	);
}

function Content({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="comparison-content"
			className={cn("min-w-0", className)}
			{...props}
		/>
	);
}

function Panels({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="comparison-panels"
			className={cn("mb-6 space-y-6", className)}
			{...props}
		/>
	);
}

interface ComparisonPanelProps extends React.ComponentProps<"div"> {
	variant: ComparisonPanelVariant;
}

function Panel({ variant, className, ...props }: ComparisonPanelProps) {
	const tone = useContext(ComparisonToneContext);

	return (
		<ComparisonPanelContext.Provider value={variant}>
			<div
				data-slot="comparison-panel"
				className={cn(
					"animate-fade-up rounded-2xl border p-5",
					variant === "without"
						? "border-border bg-muted/50"
						: tonePanelClass[tone],
					className,
				)}
				{...props}
			/>
		</ComparisonPanelContext.Provider>
	);
}

function PanelTitle({ className, ...props }: React.ComponentProps<"p">) {
	const tone = useContext(ComparisonToneContext);
	const variant = useContext(ComparisonPanelContext);

	return (
		<p
			data-slot="comparison-panel-title"
			className={cn(
				"mb-3 text-sm font-semibold uppercase tracking-wide",
				variant === "without" ? "text-muted-foreground" : toneTextClass[tone],
				className,
			)}
			{...props}
		/>
	);
}

function PanelList({ className, ...props }: React.ComponentProps<"ul">) {
	return (
		<ul
			data-slot="comparison-panel-list"
			className={cn("space-y-3", className)}
			{...props}
		/>
	);
}

interface ComparisonPanelItemProps extends React.ComponentProps<"li"> {
	/** Replaces the default XCircle/CheckCircle mark. */
	icon?: React.ReactNode;
}

function PanelItem({
	icon,
	className,
	children,
	...props
}: ComparisonPanelItemProps) {
	const variant = useContext(ComparisonPanelContext);

	return (
		<li
			data-slot="comparison-panel-item"
			className={cn("flex animate-fade-up items-start gap-3", className)}
			{...props}
		>
			{icon ??
				(variant === "without" ? (
					<XCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
				) : (
					<CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-success" />
				))}
			<span className={cn(variant === "without" && "text-muted-foreground")}>
				{children}
			</span>
		</li>
	);
}

function TagList({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="comparison-tag-list"
			className={cn("mb-8 flex flex-wrap gap-2", className)}
			{...props}
		/>
	);
}

function Tag({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			data-slot="comparison-tag"
			className={cn(
				"rounded-full border border-border bg-background px-3 py-1 text-sm",
				className,
			)}
			{...props}
		/>
	);
}

/** Illustration column — hidden below `lg`. */
function Media({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="comparison-media"
			className={cn("hidden lg:block", className)}
			{...props}
		/>
	);
}

export const ComparisonSection = {
	Root,
	Content,
	Panels,
	Panel,
	PanelTitle,
	PanelList,
	PanelItem,
	TagList,
	Tag,
	Media,
};

export type {
	ComparisonPanelItemProps,
	ComparisonPanelProps,
	ComparisonPanelVariant,
	ComparisonSectionRootProps,
};
