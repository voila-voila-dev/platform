import { Context } from "effect";

export interface SearchBudgetLimits {
	readonly windowSeconds: number;
	readonly perCaller: number;
	readonly global: number;
}

export const SearchBudget = Context.Reference<SearchBudgetLimits>(
	"@voila.dev/platform/SearchBudget",
	{ defaultValue: () => ({ windowSeconds: 60, perCaller: 60, global: 600 }) },
);
