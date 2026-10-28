import {
	defaultFilterLabels,
	Filter,
	type FilterValues,
} from "@voila.dev/ui/filter";
import { useState } from "react";
import { ALL } from "./fixtures";

export function Chips() {
	const [values, setValues] = useState<FilterValues>({
		status: { kind: "select", values: ["failed"] },
		recipient: { kind: "text", text: "name@example.com" },
	});
	return (
		<div className="w-full">
			<Filter.Chips
				definitions={ALL}
				values={values}
				onValuesChange={setValues}
				labels={defaultFilterLabels}
				locale="en-US"
			/>
		</div>
	);
}
