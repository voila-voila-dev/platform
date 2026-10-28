import { SiteFooterBottom } from "#/components/site-footer/bottom.tsx";
import { SiteFooterBottomText } from "#/components/site-footer/bottom-text.tsx";
import { SiteFooterBrand } from "#/components/site-footer/brand.tsx";
import { SiteFooterBrandDescription } from "#/components/site-footer/brand-description.tsx";
import { SiteFooterColumn } from "#/components/site-footer/column.tsx";
import { SiteFooterColumnLink } from "#/components/site-footer/column-link.tsx";
import { SiteFooterColumnList } from "#/components/site-footer/column-list.tsx";
import { SiteFooterColumnTitle } from "#/components/site-footer/column-title.tsx";
import { SiteFooterColumns } from "#/components/site-footer/columns.tsx";
import { SiteFooterRoot } from "#/components/site-footer/root.tsx";
import { SiteFooterSocialLink } from "#/components/site-footer/social-link.tsx";
import { SiteFooterSocialLinks } from "#/components/site-footer/social-links.tsx";

/**
 * Compose: `Root > Columns (Brand > BrandDescription + SocialLinks >
 * SocialLink…, Column > ColumnTitle + ColumnList > ColumnLink…) + Bottom >
 * BottomText…`.
 */
export const SiteFooter = {
	Root: SiteFooterRoot,
	Columns: SiteFooterColumns,
	Brand: SiteFooterBrand,
	BrandDescription: SiteFooterBrandDescription,
	SocialLinks: SiteFooterSocialLinks,
	SocialLink: SiteFooterSocialLink,
	Column: SiteFooterColumn,
	ColumnTitle: SiteFooterColumnTitle,
	ColumnList: SiteFooterColumnList,
	ColumnLink: SiteFooterColumnLink,
	Bottom: SiteFooterBottom,
	BottomText: SiteFooterBottomText,
};
