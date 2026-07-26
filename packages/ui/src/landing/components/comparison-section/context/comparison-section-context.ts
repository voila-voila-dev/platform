import { createContext } from "react";
import type { Tone } from "#/landing/lib/tones.ts";

/** Which side of the comparison a panel is: the old way, or yours. */
export type ComparisonPanelVariant = "without" | "with";

/** The tone `ComparisonSection.Root` sets, read by the panels. */
export const ComparisonToneContext = createContext<Tone>("primary");

/** The variant `ComparisonSection.Panel` sets, read by its title and items. */
export const ComparisonPanelContext =
	createContext<ComparisonPanelVariant>("with");
