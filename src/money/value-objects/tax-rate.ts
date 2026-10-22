import { Schema } from "effect";
import { boundedBasisPoints } from "#money/value-objects/basis-points";

export const TaxRate = boundedBasisPoints("tax rate").pipe(
	Schema.brand("TaxRate"),
);

export type TaxRate = typeof TaxRate.Type;
