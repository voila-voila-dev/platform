import { useEmailEditorTheme } from "#/email-block-editor/context/email-editor-context.tsx";
/**
 * Neutral stand-in for the branded header the server prepends. Pass
 * `headerSlot` to render your own logo instead.
 */
export function CardHeaderPlaceholder() {
	const theme = useEmailEditorTheme();
	return (
		<div
			className="flex justify-center pt-8 pb-2 text-[13px]"
			style={{ color: theme.color.muted, fontFamily: theme.font }}
		>
			<div className="rounded-md border border-dashed px-4 py-3">
				Your header
			</div>
		</div>
	);
}
