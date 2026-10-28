import { PaletteIcon } from "@phosphor-icons/react";
import { Button } from "@voila.dev/ui/button";
import { DropdownMenu } from "@voila.dev/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { applyPalette, PALETTE_STORAGE_KEY, PALETTES } from "@/lib/palettes";

/**
 * Switches the shipped theme the whole docs site renders in. The inline script in
 * `__root.tsx` applies the stored choice before paint; this menu only has to flip
 * and persist it.
 */
export function PaletteSelect() {
	const [palette, setPalette] = useState("default");

	// The stored value is applied before hydration, so read it back rather than
	// guessing — otherwise the menu shows "Default" over an Olive page.
	useEffect(() => {
		const stored = document.documentElement.dataset.palette;
		if (stored !== undefined && stored !== "") setPalette(stored);
	}, []);

	const select = (id: string) => {
		setPalette(id);
		document.documentElement.dataset.palette = id;
		applyPalette(id);
		try {
			localStorage.setItem(PALETTE_STORAGE_KEY, id);
		} catch {
			/* private mode: the choice just does not persist */
		}
	};

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				render={
					<Button variant="ghost" size="icon-sm" aria-label="Change theme" />
				}
			>
				<PaletteIcon />
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" className="w-64">
				<DropdownMenu.Label>Theme</DropdownMenu.Label>
				<DropdownMenu.RadioGroup value={palette} onValueChange={select}>
					{PALETTES.map((option) => (
						<DropdownMenu.RadioItem key={option.id} value={option.id}>
							<span
								aria-hidden
								className="size-3 shrink-0 rounded-full border border-border"
								style={{ background: option.swatch }}
							/>
							<span className="flex-1">{option.label}</span>
							<span className="whitespace-nowrap text-muted-foreground text-xs">
								{option.hint}
							</span>
						</DropdownMenu.RadioItem>
					))}
				</DropdownMenu.RadioGroup>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}
