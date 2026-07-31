import {
	defaultFilterLabels,
	Filter,
	type FilterValues,
} from "@voila.dev/ui/filter";
import { useState } from "react";
import { ALL } from "./fixtures";

export function Form() {
	const [values, setValues] = useState<FilterValues>({});
	return (
		<div className="w-full max-w-md">
			<Filter.Form
				definitions={ALL}
				values={values}
				onValuesChange={setValues}
				labels={defaultFilterLabels}
				locale="en-US"
			/>
		</div>
	);
}
