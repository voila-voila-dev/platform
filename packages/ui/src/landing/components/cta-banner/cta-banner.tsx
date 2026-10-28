import { CtaBannerActions } from "#/landing/components/cta-banner/actions.tsx";
import { CtaBannerDescription } from "#/landing/components/cta-banner/description.tsx";
import { CtaBannerRoot } from "#/landing/components/cta-banner/root.tsx";
import { CtaBannerTitle } from "#/landing/components/cta-banner/title.tsx";

/** Compose: `Root > Title + Description + Actions`. */
export const CtaBanner = {
	Root: CtaBannerRoot,
	Title: CtaBannerTitle,
	Description: CtaBannerDescription,
	Actions: CtaBannerActions,
};
