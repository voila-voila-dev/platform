import { MegaphoneIcon, WarningIcon } from "@phosphor-icons/react";
import { Banner } from "@voila.dev/ui/banner";
import { Button } from "@voila.dev/ui/button";

export function BannerVariants() {
	return (
		<div className="flex w-full flex-col gap-3">
			<Banner.Root>
				<MegaphoneIcon />
				<Banner.Title>
					Messaging is now available — chat with your clients.
				</Banner.Title>
				<Banner.Close />
			</Banner.Root>
			<Banner.Root variant="muted">
				<Banner.Title>
					Scheduled maintenance Sunday from 2 am to 4 am.
				</Banner.Title>
				<Banner.Close />
			</Banner.Root>
			<Banner.Root variant="warning">
				<WarningIcon />
				<Banner.Title>
					Your Stripe account is incomplete — finish the setup.
				</Banner.Title>
			</Banner.Root>
			<Banner.Root variant="destructive">
				<WarningIcon />
				<Banner.Title>Your subscription payment has failed.</Banner.Title>
			</Banner.Root>
		</div>
	);
}

export function BannerWithAction() {
	return (
		<Banner.Root>
			<MegaphoneIcon />
			<Banner.Title>
				Messaging is now available — chat with your clients.
			</Banner.Title>
			<Banner.Action>
				<Button
					variant="outline"
					size="xs"
					className="border-current/30 bg-transparent text-current hover:bg-current/10 hover:text-current"
				>
					Discover
				</Button>
			</Banner.Action>
			<Banner.Close />
		</Banner.Root>
	);
}
