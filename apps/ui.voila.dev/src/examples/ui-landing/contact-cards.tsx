import { Button } from "@voila.dev/ui/button";
import { ContactCards } from "@voila.dev/ui/landing";

export function Default() {
	return (
		<ContactCards.Root>
			<ContactCards.Card>
				<ContactCards.CardTitle>By email</ContactCards.CardTitle>
				<ContactCards.CardDescription>
					For any question about the platform or a partnership.
				</ContactCards.CardDescription>
				<Button
					variant="outline"
					render={<a href="mailto:contact@acme.dev">contact@acme.dev</a>}
				/>
			</ContactCards.Card>
			<ContactCards.Card>
				<ContactCards.CardTitle>By phone</ContactCards.CardTitle>
				<ContactCards.CardDescription>
					Monday to Friday, from 9 am to 6 pm.
				</ContactCards.CardDescription>
				<Button
					variant="outline"
					render={<a href="tel:+15550100100">+1 (555) 010-0100</a>}
				/>
			</ContactCards.Card>
		</ContactCards.Root>
	);
}
