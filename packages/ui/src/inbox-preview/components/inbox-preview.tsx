import { cn } from "#/lib/utils.ts";

export interface InboxPreviewLabels {
	/** Names the wide mock. */
	readonly desktop: string;
	/** Names the narrow one. */
	readonly mobile: string;
	/** The mailbox the rows sit in. */
	readonly inbox: string;
	/** When the mail arrived; a fixed string, since nothing has been sent. */
	readonly time: string;
	/** Stands in for a subject that has not been written yet. */
	readonly emptySubject: string;
}

const DEFAULT_LABELS: InboxPreviewLabels = {
	desktop: "Desktop",
	mobile: "Phone",
	inbox: "Inbox",
	time: "just now",
	emptySubject: "(No subject)",
};

interface Props {
	/** The name a recipient sees, not the address: that is what a list shows. */
	sender: string;
	subject: string;
	/** The grey line that trails the subject. Empty is a real state — the client
	 * then fills the room with the start of the body. */
	preheader?: string;
	/** Copy; English by default, one key per string on screen. */
	labels?: Partial<InboxPreviewLabels>;
	className?: string;
}

/**
 * How an email lands in a list, before anyone opens it: sender, subject, and
 * the preheader trailing behind. Those three lines decide whether the rest is
 * ever read, and they are edited in a form that gives no idea of how much of
 * them survives — a subject runs out around 40 characters on a phone.
 *
 * Deliberately our own chrome rather than a replica of Gmail's or Mail's. What
 * transfers between clients is the reading order and where each line is cut;
 * the shade of blue is not, and a replica would go stale the week the client
 * it copies is redesigned.
 *
 * Both mocks at once, not a device toggle: the phone is where the subject runs
 * out, and a toggle hides exactly the view the author most needs to see.
 */
export function InboxPreview({
	sender,
	subject,
	preheader = "",
	labels,
	className,
}: Props) {
	const copy = { ...DEFAULT_LABELS, ...labels };
	const written = subject.trim() !== "";
	const line = written ? subject : copy.emptySubject;
	const trailing = preheader.trim();

	return (
		<div
			data-slot="inbox-preview"
			className={cn(
				"grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_260px]",
				className,
			)}
		>
			<DesktopRow
				label={copy.desktop}
				inbox={copy.inbox}
				time={copy.time}
				sender={sender}
				subject={line}
				preheader={trailing}
				muted={!written}
			/>
			<PhoneRow
				label={copy.mobile}
				inbox={copy.inbox}
				time={copy.time}
				sender={sender}
				subject={line}
				preheader={trailing}
				muted={!written}
			/>
		</div>
	);
}

interface RowProps {
	label: string;
	inbox: string;
	time: string;
	sender: string;
	subject: string;
	preheader: string;
	/** The subject is a placeholder rather than the author's own words. */
	muted: boolean;
}

/** A desktop client: one line per email, so the preheader only gets what is
 * left of the row after the subject. */
function DesktopRow({
	label,
	inbox,
	time,
	sender,
	subject,
	preheader,
	muted,
}: RowProps) {
	return (
		<div className="grid gap-2">
			<span className="text-muted-foreground text-xs">{label}</span>
			<div className="overflow-hidden rounded-lg border bg-background">
				<div className="border-b bg-muted/50 px-3 py-2 text-muted-foreground text-xs">
					{inbox}
				</div>
				<div className="flex items-center gap-3 px-3 py-2.5">
					<span className="size-2 shrink-0 rounded-full bg-primary" />
					<span className="w-32 shrink-0 truncate font-medium text-sm">
						{sender}
					</span>
					<p className="min-w-0 flex-1 truncate text-sm">
						<span className={muted ? "text-muted-foreground" : undefined}>
							{subject}
						</span>
						{preheader === "" ? null : (
							<span className="text-muted-foreground">{` — ${preheader}`}</span>
						)}
					</p>
					<span className="shrink-0 text-muted-foreground text-xs">{time}</span>
				</div>
				<NeighbourRow />
				<NeighbourRow />
			</div>
		</div>
	);
}

/** The mails around it, dimmed: the row above has to read as one email among
 * many rather than as a card of its own. */
function NeighbourRow() {
	return (
		<div className="flex items-center gap-3 border-t px-3 py-2.5">
			<span className="size-2 shrink-0 rounded-full bg-muted" />
			<span className="h-2.5 w-32 shrink-0 rounded-full bg-muted" />
			<span className="h-2.5 min-w-0 flex-1 rounded-full bg-muted/60" />
		</div>
	);
}

/** A phone: two lines of preview under the subject, and far less width for the
 * subject itself. */
function PhoneRow({
	label,
	inbox,
	time,
	sender,
	subject,
	preheader,
	muted,
}: RowProps) {
	return (
		<div className="grid gap-2">
			<span className="text-muted-foreground text-xs">{label}</span>
			<div className="overflow-hidden rounded-2xl border bg-background p-2">
				<div className="flex items-center justify-between px-2 pt-1 pb-2">
					<span className="font-medium text-xs">{inbox}</span>
					<span className="text-muted-foreground text-xs">{time}</span>
				</div>
				<div className="flex gap-2 px-2 py-2">
					<span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
					<div className="grid min-w-0 gap-0.5">
						<span className="truncate font-medium text-sm">{sender}</span>
						<span
							className={cn(
								"truncate text-sm",
								muted && "text-muted-foreground",
							)}
						>
							{subject}
						</span>
						<p className="line-clamp-2 text-muted-foreground text-xs">
							{preheader}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
