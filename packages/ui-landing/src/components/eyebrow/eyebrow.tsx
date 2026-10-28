import { EyebrowDot } from "#/components/eyebrow/dot.tsx";
import { EyebrowIcon } from "#/components/eyebrow/icon.tsx";
import { EyebrowLabel } from "#/components/eyebrow/label.tsx";
import { EyebrowRoot } from "#/components/eyebrow/root.tsx";

/** Compose: `Root > Dot? + Icon? + Label`. */
export const Eyebrow = {
	Root: EyebrowRoot,
	Dot: EyebrowDot,
	Icon: EyebrowIcon,
	Label: EyebrowLabel,
};
