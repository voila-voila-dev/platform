import { BannerAction } from "#/banner/components/banner-action.tsx";
import { BannerClose } from "#/banner/components/banner-close.tsx";
import { BannerRoot } from "#/banner/components/banner-root.tsx";
import { BannerTitle } from "#/banner/components/banner-title.tsx";

/**
 * The Banner parts as one namespace.
 */
export const Banner = {
	Root: BannerRoot,
	Action: BannerAction,
	Close: BannerClose,
	Title: BannerTitle,
};
