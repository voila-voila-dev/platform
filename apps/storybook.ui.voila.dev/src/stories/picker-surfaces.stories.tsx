import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { DatePicker, type DateRange } from "@voila.dev/ui/date-picker";
import { DateTimePicker } from "@voila.dev/ui/date-time-picker";
import { TimePicker } from "@voila.dev/ui/time-picker";
import { useState } from "react";

/**
 * Every picker family, every surface, on one page — the view that makes an
 * inconsistency between them obvious. Resize below 768px and the whole
 * Responsive column flips to the OS controls while the other two hold still.
 */
const meta = {
	title: "UI/Picker surfaces",
	parameters: {
		docs: {
			description: {
				component:
					"Root / Native / Responsive across Date, DateRange, DateTime, DateTimeRange and Time.",
			},
		},
	},
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function Row({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-2 border-border border-b py-4 last:border-b-0">
			<span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
				{label}
			</span>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">{children}</div>
		</div>
	);
}

function Cell({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-muted-foreground text-xs">{label}</span>
			{children}
		</div>
	);
}

export const Matrix: Story = {
	render: () => {
		const [day, setDay] = useState<Date | null>(new Date(2026, 5, 20));
		const [range, setRange] = useState<DateRange>({
			from: new Date(2026, 5, 15),
			to: new Date(2026, 5, 20),
		});
		const [popoverRange, setPopoverRange] = useState<DateRange | null>({
			from: new Date(2026, 5, 15),
			to: new Date(2026, 5, 20),
		});
		const [instant, setInstant] = useState<Date | null>(
			new Date(2026, 5, 20, 9, 0),
		);
		const [span, setSpan] = useState({
			start: new Date(2026, 5, 20, 9, 0) as Date | null,
			end: new Date(2026, 5, 20, 17, 0) as Date | null,
		});
		const [time, setTime] = useState<string | null>("14:30");

		return (
			<div className="w-full max-w-5xl p-4">
				<Row label="Date">
					<Cell label="Root">
						<DatePicker.Root
							value={day}
							onValueChange={setDay}
							className="w-full"
						/>
					</Cell>
					<Cell label="Native">
						<DatePicker.Native
							value={day}
							onValueChange={setDay}
							className="w-full"
						/>
					</Cell>
					<Cell label="Responsive">
						<DatePicker.Responsive
							value={day}
							onValueChange={setDay}
							className="w-full"
							min={new Date(1900, 0, 1)}
							max={new Date()}
						/>
					</Cell>
				</Row>

				<Row label="Date range">
					<Cell label="Range (popover)">
						<DatePicker.Range
							value={popoverRange}
							onValueChange={setPopoverRange}
							className="w-full"
						/>
					</Cell>
					<Cell label="NativeRange">
						<DatePicker.NativeRange value={range} onValueChange={setRange} />
					</Cell>
					<Cell label="ResponsiveRange">
						<DatePicker.ResponsiveRange
							value={range}
							onValueChange={setRange}
						/>
					</Cell>
				</Row>

				<Row label="Date and time">
					<Cell label="Root">
						<DateTimePicker.Root
							value={instant}
							onValueChange={setInstant}
							className="w-full"
						/>
					</Cell>
					<Cell label="Native">
						<DateTimePicker.Native
							value={instant}
							onValueChange={setInstant}
							className="w-full"
						/>
					</Cell>
					<Cell label="Responsive">
						<DateTimePicker.Responsive
							value={instant}
							onValueChange={setInstant}
							className="w-full"
						/>
					</Cell>
				</Row>

				<Row label="Date and time range">
					<Cell label="Range">
						<DateTimePicker.Range value={span} onValueChange={setSpan} />
					</Cell>
					<Cell label="NativeRange">
						<DateTimePicker.NativeRange value={span} onValueChange={setSpan} />
					</Cell>
					<Cell label="ResponsiveRange">
						<DateTimePicker.ResponsiveRange
							value={span}
							onValueChange={setSpan}
						/>
					</Cell>
				</Row>

				<Row label="Time">
					<Cell label="Root">
						<TimePicker.Root
							value={time}
							onValueChange={setTime}
							className="w-full"
						/>
					</Cell>
					<Cell label="Native">
						<TimePicker.Native
							value={time}
							onValueChange={setTime}
							className="w-full"
						/>
					</Cell>
					<Cell label="Responsive">
						<TimePicker.Responsive
							value={time}
							onValueChange={setTime}
							className="w-full"
						/>
					</Cell>
				</Row>
			</div>
		);
	},
};
