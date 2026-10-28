import { ComparisonContent } from "#/components/comparison-section/content.tsx";
import { ComparisonMedia } from "#/components/comparison-section/media.tsx";
import { ComparisonPanel } from "#/components/comparison-section/panel.tsx";
import { ComparisonPanelItem } from "#/components/comparison-section/panel-item.tsx";
import { ComparisonPanelList } from "#/components/comparison-section/panel-list.tsx";
import { ComparisonPanelTitle } from "#/components/comparison-section/panel-title.tsx";
import { ComparisonPanels } from "#/components/comparison-section/panels.tsx";
import { ComparisonSectionRoot } from "#/components/comparison-section/root.tsx";
import { ComparisonTag } from "#/components/comparison-section/tag.tsx";
import { ComparisonTagList } from "#/components/comparison-section/tag-list.tsx";

/**
 * Compose: `Root (tone) > Content (Eyebrow, Heading, Panels > Panel >
 * PanelTitle + PanelList > PanelItem, TagList > Tag) + Media`.
 */
export const ComparisonSection = {
	Root: ComparisonSectionRoot,
	Content: ComparisonContent,
	Panels: ComparisonPanels,
	Panel: ComparisonPanel,
	PanelTitle: ComparisonPanelTitle,
	PanelList: ComparisonPanelList,
	PanelItem: ComparisonPanelItem,
	TagList: ComparisonTagList,
	Tag: ComparisonTag,
	Media: ComparisonMedia,
};
