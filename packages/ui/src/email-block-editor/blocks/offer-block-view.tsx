import { EmailCardButton } from "#/content-editor/components/email-card/email-card-button.tsx";
import { EmailCardFeatureList } from "#/content-editor/components/email-card/email-card-feature-list.tsx";
import { EmailCardShell } from "#/content-editor/components/email-card/email-card-shell.tsx";
import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
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
			<EmailCardFeatureList features={block.features} />
			<EmailCardButton label={block.buttonLabel} />
		</EmailCardShell>
	);
}
