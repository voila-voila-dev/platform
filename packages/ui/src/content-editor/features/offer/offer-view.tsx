import { EmailCardButton } from "#/content-editor/components/email-card/email-card-button.tsx";
import { EmailCardFeatureList } from "#/content-editor/components/email-card/email-card-feature-list.tsx";
import { EmailCardMeta } from "#/content-editor/components/email-card/email-card-meta.tsx";
import { EmailCardShell } from "#/content-editor/components/email-card/email-card-shell.tsx";
import { useContentEditorLabels } from "#/content-editor/context/content-editor-context.tsx";
import { useContentEditorTheme } from "#/content-editor/context/theme-context.ts";
import type { ContentOfferNode } from "#/content-editor/features/offer/reader.tsx";
import { formatPreviewPrice } from "#/content-editor/lib/money.ts";

/**
 * The email block editor's offer card, as a preview: eyebrow, name, price
 * and period, description, the ticked features, the button. A highlighted
 * offer is framed in the brand colour.
 */
export function OfferView({ node }: { readonly node: ContentOfferNode }) {
	const theme = useContentEditorTheme();
	const { fields } = useContentEditorLabels();
	return (
		<EmailCardShell
			image={node.image.src === "" ? undefined : node.image}
			highlighted={node.highlighted}
		>
			{node.eyebrow === "" ? null : (
				<span
					className="font-semibold text-[11px] uppercase tracking-[0.06em]"
					style={{ color: theme.color.brand }}
				>
					{node.eyebrow}
				</span>
			)}
			<div
				className="font-bold text-[17px] leading-[1.3]"
				style={{ color: theme.color.brand }}
			>
				{node.name || (
					<span className="opacity-40">{fields.offerNamePlaceholder}</span>
				)}
			</div>
			<div className="flex items-baseline gap-1.5">
				<span
					className="font-bold text-[26px] leading-[1.1]"
					style={{ color: theme.color.ink }}
				>
					{formatPreviewPrice(node.price, theme.locale)}
				</span>
				{node.period === "" ? null : (
					<EmailCardMeta>{node.period}</EmailCardMeta>
				)}
			</div>
			{node.description === "" ? null : (
				<p
					className="whitespace-pre-line text-[15px] leading-[1.5]"
					style={{ color: theme.color.ink }}
				>
					{node.description}
				</p>
			)}
			<EmailCardFeatureList
				features={node.features.filter((feature) => feature !== "")}
			/>
			<EmailCardButton label={node.buttonLabel} />
		</EmailCardShell>
	);
}
