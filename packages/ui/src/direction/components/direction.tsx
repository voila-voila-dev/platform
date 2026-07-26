/**
 * Re-export of Base UI's reading-direction context.
 *
 * `DirectionProvider` only informs Base UI's logical positioning and keyboard
 * navigation (popup sides like `inline-start`, arrow-key orientation in
 * menus). It does not set the `dir` attribute on the DOM: text alignment,
 * visual ordering, and portaled popups (rendered under `document.body`) still
 * follow the closest DOM `dir` ancestor. When localizing to a right-to-left
 * language, set `dir="rtl"` on `<html>` alongside the provider.
 */
export {
	DirectionProvider,
	type TextDirection as Direction,
	useDirection,
} from "@base-ui/react/direction-provider";
