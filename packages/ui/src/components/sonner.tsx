import {
	CheckCircleIcon,
	InfoIcon,
	WarningIcon,
	WarningOctagonIcon,
} from "@phosphor-icons/react";
import * as React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { Spinner } from "#/components/spinner.tsx";

/* Theme is resolved from the `.dark` class on <html> — the same mechanism the
 * design tokens use — so the Toaster works without any theme provider. */
function subscribeToRootThemeClass(onChange: () => void): () => void {
	const observer = new MutationObserver(onChange);
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class"],
	});
	return () => observer.disconnect();
}

function getResolvedTheme(): "light" | "dark" {
	return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function useResolvedTheme(): "light" | "dark" {
	return React.useSyncExternalStore(
		subscribeToRootThemeClass,
		getResolvedTheme,
		() => "light",
	);
}

function Toaster(props: ToasterProps) {
	const theme = useResolvedTheme();

	return (
		<Sonner
			theme={theme}
			className="toaster group"
			closeButton
			icons={{
				success: <CheckCircleIcon className="size-4 text-success" />,
				info: <InfoIcon className="size-4" />,
				warning: <WarningIcon className="size-4 text-warning" />,
				error: <WarningOctagonIcon className="size-4 text-destructive" />,
				loading: <Spinner />,
			}}
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
					"--border-radius": "var(--radius)",
				} as React.CSSProperties
			}
			{...props}
		/>
	);
}

export { toast } from "sonner";
export type { ToasterProps };
export { Toaster };
