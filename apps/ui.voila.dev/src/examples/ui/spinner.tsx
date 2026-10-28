import { Button } from "@voila.dev/ui/button";
import { Spinner } from "@voila.dev/ui/spinner";

export function SpinnerDefault() {
	return (
		<>
			<Spinner className="size-4" />
			<Spinner className="size-6" />
			<Spinner className="size-8 text-brand" />
			<Button disabled>
				<Spinner />
				Publishing project
			</Button>
		</>
	);
}
