import { LogoMarqueeItem } from "#/landing/components/logo-marquee/item.tsx";
import { LogoMarqueeRoot } from "#/landing/components/logo-marquee/root.tsx";
import { LogoMarqueeStaticTrack } from "#/landing/components/logo-marquee/static-track.tsx";
import { LogoMarqueeTitle } from "#/landing/components/logo-marquee/title.tsx";
import { LogoMarqueeTrack } from "#/landing/components/logo-marquee/track.tsx";
import { LogoMarqueeViewport } from "#/landing/components/logo-marquee/viewport.tsx";

/** Compose: `Root > Title? + Viewport > (Track | StaticTrack) > Item…`. */
export const LogoMarquee = {
	Root: LogoMarqueeRoot,
	Title: LogoMarqueeTitle,
	Viewport: LogoMarqueeViewport,
	Track: LogoMarqueeTrack,
	StaticTrack: LogoMarqueeStaticTrack,
	Item: LogoMarqueeItem,
};
