import { createContext } from "react";
import type { Tone } from "#/landing/lib/tones.ts";

/** The tone `StepTracks.Track` sets, read by every part below it. */
export const StepTracksToneContext = createContext<Tone>("primary");
