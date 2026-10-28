import { EmailCardButton } from "#/content-editor/components/email-card/email-card-button.tsx";
import { EmailCardShell } from "#/content-editor/components/email-card/email-card-shell.tsx";
import { useContentEditorLabels } from "#/content-editor/context/content-editor-context.tsx";
import { useContentEditorTheme } from "#/content-editor/context/theme-context.ts";
import type { ContentProductNode } from "#/content-editor/features/product/reader.tsx";
import { formatPreviewPrice } from "#/content-editor/lib/money.ts";

/**
 * The email block editor's product card, as a preview: visual, name,
 * description, the price with its struck-through base price, the button.
 */
export function ProductView({ node }: { readonly node: ContentProductNode }) {
	const theme = useContentEditorTheme();
	const { fields } = useContentEditorLabels();
	return (
		<EmailCardShell image={node.image}>
			<div
				className="font-bold text-[17px] leading-[1.3]"
				style={{ color: theme.color.brand }}
			>
				{node.name || (
					<span className="opacity-40">{fields.productNamePlaceholder}</span>
				)}
			</div>
			<p
				className="whitespace-pre-line text-[15px] leading-[1.5]"
				style={{ color: theme.color.ink }}
			>
				{node.description || (
					<span className="opacity-40">
						{fields.productDescriptionPlaceholder}
					</span>
				)}
			</p>
			<div className="flex items-baseline gap-2">
				<span
					className="font-bold text-[18px]"
					style={{ color: theme.color.ink }}
				>
					{formatPreviewPrice(node.price, theme.locale)}
				</span>
				{node.compareAtPrice == null ? null : (
					<span
						className="text-[14px] line-through"
						style={{ color: theme.color.muted }}
					>
						{formatPreviewPrice(node.compareAtPrice, theme.locale)}
					</span>
				)}
			</div>
			<EmailCardButton label={node.buttonLabel} />
		</EmailCardShell>
	);
}
