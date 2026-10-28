import { CtaBannerActions } from "#/components/cta-banner/actions.tsx";
import { CtaBannerDescription } from "#/components/cta-banner/description.tsx";
import { CtaBannerRoot } from "#/components/cta-banner/root.tsx";
import { CtaBannerTitle } from "#/components/cta-banner/title.tsx";

/** Compose: `Root > Title + Description + Actions`. */
export const CtaBanner = {
	Root: CtaBannerRoot,
	Title: CtaBannerTitle,
	Description: CtaBannerDescription,
	Actions: CtaBannerActions,
};
