import {
	CalendarPlusIcon,
	CheckCircleIcon,
	InfoIcon,
	MegaphoneIcon,
	WarningCircleIcon,
	WarningIcon,
} from "@phosphor-icons/react";
import { Alert } from "@voila.dev/ui/alert";
import { Banner } from "@voila.dev/ui/banner";
import { Button } from "@voila.dev/ui/button";
import { Card } from "@voila.dev/ui/card";
import { Empty } from "@voila.dev/ui/empty";
import { Progress } from "@voila.dev/ui/progress";
import { Skeleton } from "@voila.dev/ui/skeleton";
import { Toaster, toast } from "@voila.dev/ui/sonner";
import { Spinner } from "@voila.dev/ui/spinner";

/* -------------------------------------------------------------------------- */
/* Alert                                                                      */
/* -------------------------------------------------------------------------- */

export function AlertVariants() {
	return (
		<div className="flex w-full flex-col gap-3">
			<Alert.Root>
				<InfoIcon />
				<Alert.Title>Project updated</Alert.Title>
				<Alert.Description>
					The client moved Friday's kickoff call to 3:00 PM.
				</Alert.Description>
			</Alert.Root>
			<Alert.Root variant="success">
				<CheckCircleIcon />
				<Alert.Title>Proposal accepted</Alert.Title>
				<Alert.Description>
					Camille Dubois will start on the project on Monday.
				</Alert.Description>
			</Alert.Root>
			<Alert.Root variant="warning">
				<WarningIcon />
				<Alert.Title>Report due soon</Alert.Title>
				<Alert.Description>
					Submit the project report within 48 hours to release the payment.
				</Alert.Description>
			</Alert.Root>
			<Alert.Root variant="destructive">
				<WarningCircleIcon />
				<Alert.Title>Payment failed</Alert.Title>
				<Alert.Description>
					We could not charge your card. Update your payment method.
				</Alert.Description>
			</Alert.Root>
		</div>
	);
}

export function AlertWithAction() {
	return (
		<div className="flex w-full flex-col gap-3">
			<Alert.Root>
				<Alert.Title>Application withdrawn</Alert.Title>
				<Alert.Description>
					You withdrew your proposal for the website redesign project.
				</Alert.Description>
				<Alert.Action>
					<Button variant="outline" size="xs">
						Undo
					</Button>
				</Alert.Action>
			</Alert.Root>
			<Alert.Root>
				<InfoIcon />
				<Alert.Title>New feature</Alert.Title>
				<Alert.Description>
					You can now message clients directly from a project page.
				</Alert.Description>
				<Alert.Close />
			</Alert.Root>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Banner                                                                     */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Progress                                                                   */
/* -------------------------------------------------------------------------- */

export function ProgressDefault() {
	return (
		<div className="flex w-full flex-col gap-6">
			<Progress.Root value={35}>
				<Progress.Label>Profile completion</Progress.Label>
				<Progress.Value />
			</Progress.Root>
			<Progress.Root value={null}>
				<Progress.Label>Uploading…</Progress.Label>
			</Progress.Root>
			<Progress.Root value={1200} max={2000}>
				<Progress.Label>Storage used</Progress.Label>
				<Progress.Value>{(_, value) => `${value} / 2000 MB`}</Progress.Value>
			</Progress.Root>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Spinner                                                                    */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Skeleton                                                                   */
/* -------------------------------------------------------------------------- */

export function SkeletonDefault() {
	return (
		<div className="flex items-center gap-4">
			<Skeleton className="size-10 rounded-full" />
			<div className="space-y-2">
				<Skeleton className="h-4 w-40" />
				<Skeleton className="h-4 w-28" />
			</div>
		</div>
	);
}

export function SkeletonCard() {
	return (
		<div role="status" className="w-72">
			<span className="sr-only">Loading project…</span>
			<Card.Root aria-hidden>
				<Card.Header>
					<Skeleton className="h-5 w-44" />
				</Card.Header>
				<Card.Content className="space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
				</Card.Content>
				<Card.Footer className="gap-2">
					<Skeleton className="h-8 w-24" />
					<Skeleton className="h-8 w-24" />
				</Card.Footer>
			</Card.Root>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Empty                                                                      */
/* -------------------------------------------------------------------------- */

export function EmptyDefault() {
	return (
		<div className="w-full max-w-96">
			<Empty.Root bordered>
				<Empty.Header>
					<Empty.Media variant="icon">
						<CalendarPlusIcon />
					</Empty.Media>
					<Empty.Title>No projects yet</Empty.Title>
					<Empty.Description>
						Create your first project to start receiving proposals from
						independent freelancers.
					</Empty.Description>
				</Empty.Header>
				<Empty.Content>
					<Button>Create a project</Button>
				</Empty.Content>
			</Empty.Root>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Sonner                                                                     */
/* -------------------------------------------------------------------------- */

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
