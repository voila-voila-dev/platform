import type { FilterDefinition } from "@voila.dev/ui/filter";
import { Field } from "./fixtures";

const ATTEMPTS = {
	kind: "number",
	key: "attempts",
	label: "Attempts",
} as const satisfies FilterDefinition;

export const NumberField = () => <Field definition={ATTEMPTS} />;
