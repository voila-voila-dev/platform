import { ResponsiveSelectContent } from "#/responsive-select/components/responsive-select-content.tsx";
import { ResponsiveSelectGroup } from "#/responsive-select/components/responsive-select-group.tsx";
import { ResponsiveSelectItem } from "#/responsive-select/components/responsive-select-item.tsx";
import { ResponsiveSelectLabel } from "#/responsive-select/components/responsive-select-label.tsx";
import { ResponsiveSelectRoot } from "#/responsive-select/components/responsive-select-root.tsx";
import { ResponsiveSelectTrigger } from "#/responsive-select/components/responsive-select-trigger.tsx";
import { ResponsiveSelectValue } from "#/responsive-select/components/responsive-select-value.tsx";

/**
 * The ResponsiveSelect parts as one namespace.
 *
 * A composable select with two surfaces from one declaration: the Base UI
 * `Select` popup on desktop and the OS-native `<select>` under the
 * `useIsMobile` breakpoint (768px), where the native picker is the better
 * touch experience. The parts map 1:1 to the underlying `Select` parts on
 * desktop; a native `<select>` is monolithic, so on mobile the `Root` projects
 * the part elements onto a single `NativeSelect` (see
 * `responsive-select-children.ts` for the nesting that projection requires).
 */
export const ResponsiveSelect = {
	Root: ResponsiveSelectRoot,
	Content: ResponsiveSelectContent,
	Group: ResponsiveSelectGroup,
	Item: ResponsiveSelectItem,
	Label: ResponsiveSelectLabel,
	Trigger: ResponsiveSelectTrigger,
	Value: ResponsiveSelectValue,
};
