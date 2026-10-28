import { Filter, type FilterValues } from "@voila.dev/ui/filter";
import { useState } from "react";
import { ALL } from "./fixtures";

export function Bar() {
	const [values, setValues] = useState<FilterValues>({});
	const [search, setSearch] = useState("");
	return (
		<div className="w-full">
			<Filter.Root
				definitions={ALL}
				values={values}
				onValuesChange={setValues}
				searchValue={search}
				onSearchChange={setSearch}
				resultCount={128}
			/>
		</div>
	);
}
