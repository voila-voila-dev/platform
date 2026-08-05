import {
	useEmailEditorLabels,
	useEmailEditorTheme,
} from "#/email-block-editor/context/email-editor-context.tsx";

interface Props {
	type: string;
}

/**
 * A stored block this editor has no definition for. Not a crash and not a
 * silent drop: a document outlives the code that wrote it, so a consumer who
 * removes a block from their registry will meet one of these, and the author
 * needs to see that something is there before deciding to delete it.
 */
export function UnknownBlock({ type }: Props) {
	const theme = useEmailEditorTheme();
	const { chrome } = useEmailEditorLabels();
	return (
		<div
			className="rounded-lg border border-dashed px-4 py-6 text-center text-[14px]"
			style={{
				borderColor: theme.color.muted,
				color: theme.color.muted,
				fontFamily: theme.font,
			}}
		>
			{chrome.unknownBlock(type)}
		</div>
	);
}
