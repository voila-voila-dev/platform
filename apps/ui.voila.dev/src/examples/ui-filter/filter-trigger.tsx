import { defaultFilterLabels, Filter } from "@voila.dev/ui/filter";

export function Trigger() {
	return (
		<div className="w-full max-w-md">
			<Filter.Trigger
				summary="name@example.com"
				activeCount={2}
				labels={defaultFilterLabels}
				onClick={() => {}}
			/>
		</div>
	);
}

// --- The end-to-end listing recipe: filters + datatable + map -------------
