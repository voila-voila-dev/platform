import { LandingHeroActions } from "#/components/landing-hero/actions.tsx";
import { LandingHeroContent } from "#/components/landing-hero/content.tsx";
import { LandingHeroHighlight } from "#/components/landing-hero/highlight.tsx";
import { LandingHeroLead } from "#/components/landing-hero/lead.tsx";
import { LandingHeroMedia } from "#/components/landing-hero/media.tsx";
import { LandingHeroRoot } from "#/components/landing-hero/root.tsx";
import { LandingHeroTitle } from "#/components/landing-hero/title.tsx";

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
