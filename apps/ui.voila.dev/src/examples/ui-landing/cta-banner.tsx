import { ArrowRightIcon } from "@phosphor-icons/react";
import { Button } from "@voila.dev/ui/button";
import { CtaBanner } from "@voila.dev/ui/landing";

export function Default() {
	return (
		<CtaBanner.Root>
			<CtaBanner.Title>Join the Acme adventure</CtaBanner.Title>
			<CtaBanner.Description>
				Client or freelancer: let's build better projects, together.
			</CtaBanner.Description>
			<CtaBanner.Actions>
				<Button size="lg" variant="secondary">
					I'm a client <ArrowRightIcon />
				</Button>
				<Button
					size="lg"
					variant="outline"
					className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
				>
					I'm a freelancer
				</Button>
			</CtaBanner.Actions>
		</CtaBanner.Root>
	);
}
