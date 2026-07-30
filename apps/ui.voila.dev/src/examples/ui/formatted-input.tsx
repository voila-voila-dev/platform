import {
	businessIdMask,
	FormattedInput,
	idNumberMask,
	phoneMask,
} from "@voila.dev/ui/formatted-input";

export function FormattedInputExample() {
	return (
		<div className="flex w-full max-w-72 flex-col gap-3">
			<FormattedInput mask={businessIdMask} placeholder="123 456 789 00012" />
			<FormattedInput mask={idNumberMask} defaultValue="10003456789" />
			<FormattedInput mask={phoneMask} defaultValue="0612345678" />
		</div>
	);
}
