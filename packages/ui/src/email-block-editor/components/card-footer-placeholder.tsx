import {
	useEmailEditorLabels,
	useEmailEditorTheme,
} from "#/email-block-editor/context/email-editor-context.tsx";
/**
 * Neutral stand-in for the branded footer the server appends. Pass
 * `footerSlot` to render your own.
 */
export function CardFooterPlaceholder() {
	const theme = useEmailEditorTheme();
	const { chrome } = useEmailEditorLabels();
	return (
		<div
			className="px-8 pt-6 pb-2 text-center text-[13px] leading-[1.6]"
			style={{ color: theme.color.muted, fontFamily: theme.font }}
		>
			<div>{chrome.footerPlaceholder}</div>
		</div>
	);
}
