import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import type {
	EmailEditorAlignment,
	EmailEditorButtonBlock,
} from "#/email-block-editor/document/types.ts";
import { EMAIL_COLOR, EMAIL_FONT } from "#/email-block-editor/theme.ts";

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
	const filled = block.variant === "primary";
	return (
		<div className="flex" style={{ justifyContent: JUSTIFY[block.align] }}>
			<span
				className="inline-block rounded-lg px-[30px] py-[13px]"
				style={{
					backgroundColor: filled ? EMAIL_COLOR.brand : "transparent",
					border: `1px solid ${EMAIL_COLOR.brand}`,
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
						fontFamily: EMAIL_FONT,
						color: filled
							? "var(--color-primary-foreground)"
							: EMAIL_COLOR.brand,
					}}
				/>
			</span>
		</div>
	);
}
