import { LogoMarqueeItem } from "#/components/logo-marquee/item.tsx";
import { LogoMarqueeRoot } from "#/components/logo-marquee/root.tsx";
import { LogoMarqueeStaticTrack } from "#/components/logo-marquee/static-track.tsx";
import { LogoMarqueeTitle } from "#/components/logo-marquee/title.tsx";
import { LogoMarqueeTrack } from "#/components/logo-marquee/track.tsx";
import { LogoMarqueeViewport } from "#/components/logo-marquee/viewport.tsx";

/** Compose: `Root > Title? + Viewport > (Track | StaticTrack) > Item…`. */
export const LogoMarquee = {
	Root: LogoMarqueeRoot,
	Title: LogoMarqueeTitle,
	Viewport: LogoMarqueeViewport,
	Track: LogoMarqueeTrack,
	StaticTrack: LogoMarqueeStaticTrack,
	Item: LogoMarqueeItem,
};
