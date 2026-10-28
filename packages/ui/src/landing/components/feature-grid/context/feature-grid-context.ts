import { createContext } from "react";
import type { Tone } from "#/landing/lib/tones.ts";

/** The tone `FeatureGrid.Root` sets, read by each card icon. */
export const FeatureGridToneContext = createContext<Tone>("primary");
