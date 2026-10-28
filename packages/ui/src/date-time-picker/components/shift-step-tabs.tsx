import { ShiftStepTab } from "#/date-time-picker/components/shift-step-tab.tsx";
import type { DateTimeRange } from "#/date-time-picker/lib/date-time-range.ts";
import {
	endLabelText,
	type ShiftStep,
	shiftStepLabel,
	startLabelText,
} from "#/date-time-picker/lib/shift-time-range.ts";

interface Props {
	step: ShiftStep;
	range: DateTimeRange;
	locale: string | undefined;
	onStepChange: (step: ShiftStep) => void;
}

/** The Start/End switch above the picker, each side showing its current summary. */
export function ShiftStepTabs({ step, range, locale, onStepChange }: Props) {
	return (
		<div
			data-slot="shift-step-tabs"
			className="grid grid-cols-2 gap-1.5 border-b p-1.5"
		>
			<ShiftStepTab
				active={step === "start"}
				heading={startLabelText(locale)}
				value={shiftStepLabel(range.start, locale)}
				onClick={() => onStepChange("start")}
			/>
			<ShiftStepTab
				active={step === "end"}
				heading={endLabelText(locale)}
				value={shiftStepLabel(range.end, locale)}
				onClick={() => onStepChange("end")}
			/>
		</div>
	);
}
