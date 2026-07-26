import type { Icon as PhosphorIconComponent } from "@phosphor-icons/react";
import * as PhosphorIcons from "@phosphor-icons/react";
import type { ComponentProps } from "react";

/**
 * Registry restricted to the `*Icon` component exports. The namespace also
 * exports non-component helpers (`IconContext`, `IconBase`, …) that must never
 * be rendered by name.
 */
const icons: Record<string, PhosphorIconComponent> = Object.fromEntries(
	Object.entries(PhosphorIcons).filter(([exportName]) =>
		exportName.endsWith("Icon"),
	),
) as Record<string, PhosphorIconComponent>;

/** Every icon name exported by `@phosphor-icons/react` (e.g. "HeartIcon"). */
export const phosphorIconNames: ReadonlyArray<string> =
	Object.keys(icons).sort();

/** Statically-typed union of valid icon names, for callers like the picker. */
export type PhosphorIconName = {
	[Key in keyof typeof PhosphorIcons]: Key extends `${string}Icon`
		? Key
		: never;
}[keyof typeof PhosphorIcons];

const FALLBACK_ICON = "TagIcon";

// `import.meta.env` is Vite-specific and untyped here; read it defensively so
// the unknown-name warning fires in dev and disappears from production builds.
const isDevelopment =
	(import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV === true;

interface Props extends ComponentProps<PhosphorIconComponent> {
	name: PhosphorIconName | (string & {});
}

/**
 * Renders a Phosphor icon by its export name. Falls back to a neutral icon if
 * the name is unknown, so stale/bad data never crashes the UI. Icons are
 * decorative (`aria-hidden`) unless an `alt` or `aria-label` is provided.
 */
export function Icon({ name, ...props }: Props) {
	const Component = icons[name];
	if (Component === undefined && isDevelopment) {
		console.warn(
			`[Icon] Unknown icon name "${name}", falling back to "${FALLBACK_ICON}".`,
		);
	}
	const ResolvedComponent = Component ?? icons[FALLBACK_ICON];
	const decorative =
		props.alt === undefined && props["aria-label"] === undefined;
	return (
		<ResolvedComponent
			data-slot="icon"
			aria-hidden={decorative || undefined}
			{...props}
		/>
	);
}
