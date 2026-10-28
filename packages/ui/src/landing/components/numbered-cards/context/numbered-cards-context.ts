import { createContext } from "react";
import type { Tone } from "#/landing/lib/tones.ts";

/** The tone `NumberedCards.Root` sets, read by the card icon. */
export const NumberedCardsToneContext = createContext<Tone>("primary");
