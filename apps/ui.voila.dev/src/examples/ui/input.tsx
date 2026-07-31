import { Input } from "@voila.dev/ui/input";

export function Default() {
	return (
		<div className="flex w-full max-w-72 flex-col gap-3">
			<Input placeholder="Search freelancers" />
			<Input type="email" defaultValue="not-an-email" aria-invalid />
			<Input readOnly defaultValue="INV-2026-00421" />
			<Input disabled placeholder="Project location" />
		</div>
	);
}
