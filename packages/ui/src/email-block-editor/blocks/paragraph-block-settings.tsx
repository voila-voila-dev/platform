/**
 * The settings panel for a paragraph block — the text itself is edited on
 * the canvas, so this holds only the block-level options.
 */
export function ParagraphBlockSettings() {
	return (
		<p className="text-muted-foreground text-xs">
			{
				"Format the text (bold, italic, underline, link) from the block toolbar. Personalize with {{firstName}}, {{lastName}} or {{email}}; the contact's value is substituted at send time."
			}
		</p>
	);
}
