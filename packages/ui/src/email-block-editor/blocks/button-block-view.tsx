import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { useEmailEditorTheme } from "#/email-block-editor/context/email-editor-context.tsx";
import type {
	EmailEditorAlignment,
	EmailEditorButtonBlock,
} from "#/email-block-editor/document/types.ts";

/** Flexbox equivalents of the email's `align` attribute. */
const JUSTIFY: { readonly [A in EmailEditorAlignment]: string } = {
	left: "flex-start",
	center: "center",
	right: "flex-end",
};

interface Props extends EmailBlockComponentProps<EmailEditorButtonBlock> {}

/**
 * The call-to-action button. The label is edited in place; the target URL, the
 * alignment and the variant live in the settings sidebar (no inline chip — the
 * button carries one link for the whole block, unlike a paragraph's
 * per-selection links). Mirrors the domain `emailButton` component.
 */
export function ButtonBlockView({ block, onChange }: Props) {
	const theme = useEmailEditorTheme();
	const filled = block.variant === "primary";
	return (
		<div className="flex" style={{ justifyContent: JUSTIFY[block.align] }}>
			<span
				className="inline-block rounded-lg px-[30px] py-[13px]"
				style={{
					backgroundColor: filled ? theme.color.brand : "transparent",
					border: `1px solid ${theme.color.brand}`,
				}}
			>
				<input
					aria-label="Button label"
					value={block.label}
					onChange={(event) =>
						onChange({ ...block, label: event.target.value })
					}
					placeholder="Your button"
					className="min-w-16 max-w-full border-none bg-transparent p-0 text-center font-semibold text-[15px] leading-none outline-none [field-sizing:content] placeholder:opacity-50"
					style={{
						fontFamily: theme.font,
						color: filled
							? "var(--color-primary-foreground)"
							: theme.color.brand,
					}}
				/>
			</span>
		</div>
	);
}
