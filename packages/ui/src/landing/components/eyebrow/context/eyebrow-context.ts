import { createContext } from "react";
import type { Tone } from "#/landing/lib/tones.ts";

/** The tone `Eyebrow.Root` sets, read by the dot, icon and label. */
export const EyebrowToneContext = createContext<Tone>("primary");
