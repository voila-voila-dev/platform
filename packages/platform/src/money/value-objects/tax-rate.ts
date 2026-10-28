import { Schema } from "effect";
import { BasisPoints } from "#money/value-objects/basis-points";

export const TaxRate = BasisPoints.pipe(Schema.brand("TaxRate"));

export type TaxRate = typeof TaxRate.Type;
