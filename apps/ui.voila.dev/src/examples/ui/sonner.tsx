import { Button } from "@voila.dev/ui/button";
import { Toaster, toast } from "@voila.dev/ui/sonner";

export function SonnerDefault() {
	return (
		<>
			<Toaster />
			<Button
				variant="outline"
				onClick={() =>
					toast("Project published", {
						description: "Matching freelancers have been notified.",
					})
				}
			>
				Show toast
			</Button>
			<Button
				variant="outline"
				onClick={() => toast.success("Proposal accepted")}
			>
				Success
			</Button>
			<Button
				variant="outline"
				onClick={() => toast.error("Payment could not be processed")}
			>
				Error
			</Button>
		</>
	);
}
