import { InboxPreview } from "@voila.dev/ui/inbox-preview";

export function InboxPreviewDefault() {
	return (
		<InboxPreview
			sender="Acme"
			subject="Your September invoice is ready"
			preheader="Due on the 30th, payable online."
		/>
	);
}

export function InboxPreviewLongSubject() {
	return (
		<InboxPreview
			sender="Acme"
			subject="Your September invoice is ready, and so is the yearly summary"
			preheader="Everything you were billed for since January, one line per project, payable online until the 30th."
		/>
	);
}

export function InboxPreviewTranslated() {
	return (
		<InboxPreview
			sender="Acme"
			subject="Votre facture de septembre est prête"
			preheader="À régler avant le 30, en ligne."
			labels={{
				desktop: "Ordinateur",
				mobile: "Téléphone",
				inbox: "Boîte de réception",
				time: "à l'instant",
				emptySubject: "(Sans objet)",
			}}
		/>
	);
}
