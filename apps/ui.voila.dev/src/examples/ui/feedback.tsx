import {
	CalendarPlusIcon,
	CheckCircleIcon,
	InfoIcon,
	MegaphoneIcon,
	WarningCircleIcon,
	WarningIcon,
} from "@phosphor-icons/react";
import {
	Alert,
	AlertAction,
	AlertClose,
	AlertDescription,
	AlertTitle,
} from "@voila.dev/ui/components/alert";
import {
	Banner,
	BannerAction,
	BannerClose,
	BannerTitle,
} from "@voila.dev/ui/components/banner";
import { Button } from "@voila.dev/ui/components/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@voila.dev/ui/components/card";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@voila.dev/ui/components/empty";
import {
	Progress,
	ProgressLabel,
	ProgressValue,
} from "@voila.dev/ui/components/progress";
import { Skeleton } from "@voila.dev/ui/components/skeleton";
import { Toaster, toast } from "@voila.dev/ui/components/sonner";
import { Spinner } from "@voila.dev/ui/components/spinner";

/* -------------------------------------------------------------------------- */
/* Alert                                                                      */
/* -------------------------------------------------------------------------- */

export function AlertVariants() {
	return (
		<div className="flex w-full flex-col gap-3">
			<Alert>
				<InfoIcon />
				<AlertTitle>Mission updated</AlertTitle>
				<AlertDescription>
					The club moved Saturday's match to 3:00 PM.
				</AlertDescription>
			</Alert>
			<Alert variant="success">
				<CheckCircleIcon />
				<AlertTitle>Booking confirmed</AlertTitle>
				<AlertDescription>
					Camille Dubois will cover the match on Saturday.
				</AlertDescription>
			</Alert>
			<Alert variant="warning">
				<WarningIcon />
				<AlertTitle>Report due soon</AlertTitle>
				<AlertDescription>
					Submit the mission report within 48 hours to release the payment.
				</AlertDescription>
			</Alert>
			<Alert variant="destructive">
				<WarningCircleIcon />
				<AlertTitle>Payment failed</AlertTitle>
				<AlertDescription>
					We could not charge your card. Update your payment method.
				</AlertDescription>
			</Alert>
		</div>
	);
}

export function AlertWithAction() {
	return (
		<div className="flex w-full flex-col gap-3">
			<Alert>
				<AlertTitle>Application withdrawn</AlertTitle>
				<AlertDescription>
					You withdrew your application for the tournament mission.
				</AlertDescription>
				<AlertAction>
					<Button variant="outline" size="xs">
						Undo
					</Button>
				</AlertAction>
			</Alert>
			<Alert>
				<InfoIcon />
				<AlertTitle>New feature</AlertTitle>
				<AlertDescription>
					You can now message clubs directly from a mission page.
				</AlertDescription>
				<AlertClose />
			</Alert>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Banner                                                                     */
/* -------------------------------------------------------------------------- */

export function BannerVariants() {
	return (
		<div className="flex w-full flex-col gap-3">
			<Banner>
				<MegaphoneIcon />
				<BannerTitle>
					La messagerie est disponible — échangez avec les clubs.
				</BannerTitle>
				<BannerClose />
			</Banner>
			<Banner variant="muted">
				<BannerTitle>Maintenance planifiée dimanche de 2h à 4h.</BannerTitle>
				<BannerClose />
			</Banner>
			<Banner variant="warning">
				<WarningIcon />
				<BannerTitle>
					Votre compte Stripe est incomplet — terminez la configuration.
				</BannerTitle>
			</Banner>
			<Banner variant="destructive">
				<WarningIcon />
				<BannerTitle>Le paiement de votre abonnement a échoué.</BannerTitle>
			</Banner>
		</div>
	);
}

export function BannerWithAction() {
	return (
		<Banner>
			<MegaphoneIcon />
			<BannerTitle>
				La messagerie est disponible — échangez avec les clubs.
			</BannerTitle>
			<BannerAction>
				<Button
					variant="outline"
					size="xs"
					className="border-current/30 bg-transparent text-current hover:bg-current/10 hover:text-current"
				>
					Découvrir
				</Button>
			</BannerAction>
			<BannerClose />
		</Banner>
	);
}

/* -------------------------------------------------------------------------- */
/* Progress                                                                   */
/* -------------------------------------------------------------------------- */

export function ProgressDefault() {
	return (
		<div className="flex w-full flex-col gap-6">
			<Progress value={35}>
				<ProgressLabel>Profile completion</ProgressLabel>
				<ProgressValue />
			</Progress>
			<Progress value={null}>
				<ProgressLabel>Uploading…</ProgressLabel>
			</Progress>
			<Progress value={1200} max={2000}>
				<ProgressLabel>Storage used</ProgressLabel>
				<ProgressValue>{(_, value) => `${value} / 2000 MB`}</ProgressValue>
			</Progress>
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
			<Spinner className="size-8 text-provider" />
			<Button disabled>
				<Spinner />
				Publishing mission
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
			<span className="sr-only">Loading mission…</span>
			<Card aria-hidden>
				<CardHeader>
					<Skeleton className="h-5 w-44" />
				</CardHeader>
				<CardContent className="space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
				</CardContent>
				<CardFooter className="gap-2">
					<Skeleton className="h-8 w-24" />
					<Skeleton className="h-8 w-24" />
				</CardFooter>
			</Card>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Empty                                                                      */
/* -------------------------------------------------------------------------- */

export function EmptyDefault() {
	return (
		<div className="w-full max-w-96">
			<Empty bordered>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<CalendarPlusIcon />
					</EmptyMedia>
					<EmptyTitle>No missions yet</EmptyTitle>
					<EmptyDescription>
						Create your first mission to start receiving applications from
						healthcare providers.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button>Create a mission</Button>
				</EmptyContent>
			</Empty>
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
					toast("Mission published", {
						description: "Providers in your area have been notified.",
					})
				}
			>
				Show toast
			</Button>
			<Button
				variant="outline"
				onClick={() => toast.success("Booking confirmed")}
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
