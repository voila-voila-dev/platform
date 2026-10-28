import { SiteHeaderActions } from "#/components/site-header/actions.tsx";
import { SiteHeaderBar } from "#/components/site-header/bar.tsx";
import { SiteHeaderBrand } from "#/components/site-header/brand.tsx";
import { SiteHeaderMobileActions } from "#/components/site-header/mobile-actions.tsx";
import { SiteHeaderMobileMenu } from "#/components/site-header/mobile-menu.tsx";
import { SiteHeaderMobileNavItem } from "#/components/site-header/mobile-nav-item.tsx";
import { SiteHeaderMobileToggle } from "#/components/site-header/mobile-toggle.tsx";
import { SiteHeaderNav } from "#/components/site-header/nav.tsx";
import { SiteHeaderNavItem } from "#/components/site-header/nav-item.tsx";
import { SiteHeaderNavList } from "#/components/site-header/nav-list.tsx";
import { SiteHeaderRoot } from "#/components/site-header/root.tsx";

/**
 * Compose: `Root > Bar (Brand + Nav > NavList > NavItem… + Actions +
 * MobileToggle) + MobileMenu > MobileNavItem… + MobileActions`.
 */
export const SiteHeader = {
	Root: SiteHeaderRoot,
	Bar: SiteHeaderBar,
	Brand: SiteHeaderBrand,
	Nav: SiteHeaderNav,
	NavList: SiteHeaderNavList,
	NavItem: SiteHeaderNavItem,
	Actions: SiteHeaderActions,
	MobileToggle: SiteHeaderMobileToggle,
	MobileMenu: SiteHeaderMobileMenu,
	MobileNavItem: SiteHeaderMobileNavItem,
	MobileActions: SiteHeaderMobileActions,
};
