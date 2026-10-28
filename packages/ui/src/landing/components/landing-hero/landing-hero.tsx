import { LandingHeroActions } from "#/landing/components/landing-hero/actions.tsx";
import { LandingHeroContent } from "#/landing/components/landing-hero/content.tsx";
import { LandingHeroHighlight } from "#/landing/components/landing-hero/highlight.tsx";
import { LandingHeroLead } from "#/landing/components/landing-hero/lead.tsx";
import { LandingHeroMedia } from "#/landing/components/landing-hero/media.tsx";
import { LandingHeroRoot } from "#/landing/components/landing-hero/root.tsx";
import { LandingHeroTitle } from "#/landing/components/landing-hero/title.tsx";

/**
 * Compose: `Root > Content (Eyebrow, Title + Highlight, Lead, Actions,
 * StatsRow) + Media`.
 */
export const LandingHero = {
	Root: LandingHeroRoot,
	Content: LandingHeroContent,
	Title: LandingHeroTitle,
	Highlight: LandingHeroHighlight,
	Lead: LandingHeroLead,
	Actions: LandingHeroActions,
	Media: LandingHeroMedia,
};
