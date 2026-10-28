import { NativeTimeInput } from "#/time-picker/components/native-time-input.tsx";
import { ResponsiveTimeInput } from "#/time-picker/components/responsive-time-input.tsx";
import { TimePickerRoot } from "#/time-picker/components/time-picker-root.tsx";

/**
 * The TimePicker parts as one namespace.
 *
 * The same three surfaces as the other picker families — `Root` is the composed
 * popover, `Native` is the OS control, `Responsive` picks between them at the
 * `useIsMobile` breakpoint — over a `"HH:mm"` value, because a time of day is
 * not an instant and a `Date` would invent a day for it.
 */
export const TimePicker = {
	Root: TimePickerRoot,
	Native: NativeTimeInput,
	Responsive: ResponsiveTimeInput,
};
