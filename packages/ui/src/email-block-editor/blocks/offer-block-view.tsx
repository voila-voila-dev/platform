import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { EmailCardButton } from "#/email-block-editor/blocks/email-card-button.tsx";
import { EmailCardShell } from "#/email-block-editor/blocks/email-card-shell.tsx";
import { OfferFeatureList } from "#/email-block-editor/blocks/offer-feature-list.tsx";
import { OfferHeader } from "#/email-block-editor/blocks/offer-header.tsx";
import { useEmailEditorTheme } from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorOfferBlock } from "#/email-block-editor/document/types.ts";

interface Props<Currency extends string>
	extends EmailBlockComponentProps<EmailEditorOfferBlock<Currency>> {}

/**
 * A pricing plan on the shared card shell: an eyebrow, a name, a price with an
 * optional period, a feature list and a call to action. `highlighted` draws
 * the recommended plan of a row in the brand colour.
 */
export function OfferBlockView<Currency extends string>({
	block,
	onChange,
}: Props<Currency>) {
	const theme = useEmailEditorTheme();
	return (
		<EmailCardShell
			image={block.image.src === "" ? undefined : block.image}
			highlighted={block.highlighted}
		>
			<OfferHeader block={block} onChange={onChange} />
			{block.description === "" ? null : (
				<p
					className="text-[15px] leading-[1.5]"
					style={{ color: theme.color.ink }}
				>
					{block.description}
				</p>
			)}
			<OfferFeatureList features={block.features} />
			<EmailCardButton label={block.buttonLabel} />
		</EmailCardShell>
	);
}
