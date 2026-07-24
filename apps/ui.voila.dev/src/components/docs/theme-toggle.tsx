import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { Button } from "@voila.dev/ui/components/button";
import { useEffect, useState } from "react";

/**
 * Toggles the `.dark` class the whole token system keys off. The inline script
 * in `__root.tsx` applies the stored value before paint; this button only has
 * to flip and persist it.
 */
export function ThemeToggle() {
	// Render a stable icon during SSR; the real state arrives after mount.
	const [dark, setDark] = useState(true);

	useEffect(() => {
		setDark(document.documentElement.classList.contains("dark"));
	}, []);

	const toggle = () => {
		const next = !dark;
		setDark(next);
		document.documentElement.classList.toggle("dark", next);
		try {
			localStorage.setItem("theme", next ? "dark" : "light");
		} catch {
			/* private mode: the choice just does not persist */
		}
	};

	return (
		<Button
			variant="ghost"
			size="icon-sm"
			aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
			onClick={toggle}
		>
			{dark ? <SunIcon /> : <MoonIcon />}
		</Button>
	);
}
