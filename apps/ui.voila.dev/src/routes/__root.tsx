/// <reference types="vite/client" />
import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
	PALETTE_HREFS,
	PALETTE_LINK_ID,
	PALETTE_STORAGE_KEY,
} from "@/lib/palettes";
import appCss from "@/styles/docs.css?url";

/**
 * Runs before first paint: applies the stored light/dark choice to the `.dark`
 * class the whole token system keys off, and the stored theme by injecting its
 * stylesheet, so a hard reload flashes neither light mode nor the default
 * palette. The hrefs are build-time constants, and the palette id is only ever
 * used as an object key, so nothing here interpolates untrusted input. An id
 * that no longer ships — a theme retired since the visitor last chose one —
 * falls back to the default instead of leaving the menu on a dead entry.
 */
const themeScript = `(()=>{try{var t=localStorage.getItem("theme");document.documentElement.classList.toggle("dark",t!=="light")}catch(e){document.documentElement.classList.add("dark")}
try{var h=${JSON.stringify(PALETTE_HREFS)},p=localStorage.getItem(${JSON.stringify(PALETTE_STORAGE_KEY)});if(p&&(p==="default"||h[p])){document.documentElement.dataset.palette=p;if(h[p]){var l=document.createElement("link");l.id=${JSON.stringify(PALETTE_LINK_ID)};l.rel="stylesheet";l.href=h[p];document.head.appendChild(l)}}}catch(e){}})()`;

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "ui.voila.dev" },
			{
				name: "description",
				content:
					"A source-shipped React + Tailwind component system. Copy it, install it, rebrand it — from buttons to a full email editor, it's yours.",
			},
			{
				property: "og:title",
				content: "Build your SaaS with AI — on components you actually own.",
			},
			{
				property: "og:description",
				content:
					"A source-shipped React + Tailwind component system. Copy it, install it, rebrand it — from buttons to a full email editor, it's yours.",
			},
			{ property: "og:type", content: "website" },
			{ property: "og:url", content: "https://ui.voila.dev" },
			{ property: "og:site_name", content: "ui.voila.dev" },
			{ property: "og:image", content: "https://ui.voila.dev/og.png" },
			{ name: "twitter:card", content: "summary_large_image" },
			{
				name: "twitter:title",
				content: "Build your SaaS with AI — on components you actually own.",
			},
			{
				name: "twitter:description",
				content: "Your AI can't customize what it can't read. Ours, it can.",
			},
			{ name: "twitter:image", content: "https://ui.voila.dev/og.png" },
		],
		links: [
			{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
			{ rel: "preconnect", href: "https://fonts.googleapis.com" },
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Instrument+Sans:wght@400;500;600;700&family=Intel+One+Mono:wght@400;500;600;700&display=swap",
			},
			{ rel: "stylesheet", href: appCss },
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		// suppressHydrationWarning: the theme script mutates <html> before React
		// hydrates, so the class attribute intentionally differs from the SSR HTML.
		<html lang="en" className="dark" suppressHydrationWarning>
			<head>
				<HeadContent />
				{/* Static inline script, no user input. It runs after HeadContent so the
				 * palette stylesheet it may inject lands after docs.css — same
				 * specificity, so the later sheet is the one that wins. */}
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
