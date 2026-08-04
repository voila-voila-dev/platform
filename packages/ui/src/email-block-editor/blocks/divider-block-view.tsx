import { useEmailEditorTheme } from "#/email-block-editor/context/email-editor-context.tsx";
/** A horizontal rule. Mirrors the domain `emailDivider` component. */
export function DividerBlockView() {
	const theme = useEmailEditorTheme();
	return (
		<hr className="my-2 border-t" style={{ borderColor: theme.color.border }} />
	);
}
