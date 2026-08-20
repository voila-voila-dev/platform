import { ResponsiveDatePickerRoot } from "#/responsive-date-picker/components/responsive-date-picker-root.tsx";

/**
 * The ResponsiveDatePicker parts as one namespace.
 *
 * One declaration, two surfaces: the composed popover calendar on desktop and
 * the OS date picker under the `useIsMobile` breakpoint (768px). There is no
 * `Range` part — no browser ships a native range input, so a date range stays
 * on `DatePicker.Range` across both surfaces.
 */
export const ResponsiveDatePicker = {
	Root: ResponsiveDatePickerRoot,
};
