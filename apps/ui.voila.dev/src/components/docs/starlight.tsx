/**
 * React stand-ins for the handful of Starlight components the content uses
 * (`Card`, `CardGrid`, `Steps`, `Tabs`, `TabItem`) so those pages keep their
 * markup across the migration. Same props as the originals, minus the ones
 * nothing here ever passed.
 */

import {
	TabsContent,
	TabsList,
	TabsTrigger,
	Tabs as UiTabs,
} from "@voila.dev/ui/components/tabs";
import { cn } from "@voila.dev/ui/lib/utils";
import type { ReactNode } from "react";

export function Card({
	title,
	children,
}: {
	title: string;
	icon?: string;
	children: ReactNode;
}) {
	return (
		<article className="not-prose rounded-xl border border-border bg-card p-5">
			<p className="font-heading text-base font-semibold text-card-foreground">
				{title}
			</p>
			<div className="mt-2 text-sm leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline dark:[&_a]:text-primary-foreground">
				{children}
			</div>
		</article>
	);
}

export function CardGrid({
	children,
	className,
}: {
	children: ReactNode;
	stagger?: boolean;
	className?: string;
}) {
	return (
		<div className={cn("not-prose my-6 grid gap-4 sm:grid-cols-2", className)}>
			{children}
		</div>
	);
}

/** Numbered vertical steps, like Starlight's `<Steps>` around an `<ol>`. */
export function Steps({ children }: { children: ReactNode }) {
	return <div className="docs-steps">{children}</div>;
}

interface TabItemProps {
	label: string;
	children: ReactNode;
}

export function TabItem(_props: TabItemProps) {
	// Rendered by <Tabs>, which reads the props directly.
	return null;
}

export function Tabs({ children }: { children: ReactNode; syncKey?: string }) {
	const items = (Array.isArray(children) ? children : [children]).filter(
		(child): child is React.ReactElement<TabItemProps> =>
			typeof child === "object" && child !== null && "props" in child,
	);
	const first = items[0]?.props.label;
	return (
		<UiTabs defaultValue={first} className="my-4">
			<TabsList>
				{items.map((item) => (
					<TabsTrigger key={item.props.label} value={item.props.label}>
						{item.props.label}
					</TabsTrigger>
				))}
			</TabsList>
			{items.map((item) => (
				<TabsContent key={item.props.label} value={item.props.label}>
					{item.props.children}
				</TabsContent>
			))}
		</UiTabs>
	);
}
