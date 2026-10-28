import { SiteFooterBottom } from "#/landing/components/site-footer/bottom.tsx";
import { SiteFooterBottomText } from "#/landing/components/site-footer/bottom-text.tsx";
import { SiteFooterBrand } from "#/landing/components/site-footer/brand.tsx";
import { SiteFooterBrandDescription } from "#/landing/components/site-footer/brand-description.tsx";
import { SiteFooterColumn } from "#/landing/components/site-footer/column.tsx";
import { SiteFooterColumnLink } from "#/landing/components/site-footer/column-link.tsx";
import { SiteFooterColumnList } from "#/landing/components/site-footer/column-list.tsx";
import { SiteFooterColumnTitle } from "#/landing/components/site-footer/column-title.tsx";
import { SiteFooterColumns } from "#/landing/components/site-footer/columns.tsx";
import { SiteFooterRoot } from "#/landing/components/site-footer/root.tsx";
import { SiteFooterSocialLink } from "#/landing/components/site-footer/social-link.tsx";
import { SiteFooterSocialLinks } from "#/landing/components/site-footer/social-links.tsx";

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
