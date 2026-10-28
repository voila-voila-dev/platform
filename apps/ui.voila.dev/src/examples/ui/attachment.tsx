import { FileCodeIcon, FilePdfIcon, XIcon } from "@phosphor-icons/react";
import { Attachment } from "@voila.dev/ui/attachment";
import { Spinner } from "@voila.dev/ui/spinner";

export function Default() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-3">
			<Attachment.Root state="uploading" className="w-full">
				<Attachment.Media>
					<Spinner />
				</Attachment.Media>
				<Attachment.Content>
					<Attachment.Title>sales-dashboard.pdf</Attachment.Title>
					<Attachment.Description>Uploading · 64%</Attachment.Description>
				</Attachment.Content>
				<Attachment.Actions>
					<Attachment.Action aria-label="Cancel upload">
						<XIcon />
					</Attachment.Action>
				</Attachment.Actions>
			</Attachment.Root>
			<Attachment.Root className="w-full">
				<Attachment.Media>
					<FileCodeIcon />
				</Attachment.Media>
				<Attachment.Content>
					<Attachment.Title>message-renderer.tsx</Attachment.Title>
					<Attachment.Description>TypeScript · 12 KB</Attachment.Description>
				</Attachment.Content>
				<Attachment.Actions>
					<Attachment.Action aria-label="Remove message-renderer.tsx">
						<XIcon />
					</Attachment.Action>
				</Attachment.Actions>
			</Attachment.Root>
			<Attachment.Root state="error" className="w-full">
				<Attachment.Media>
					<FilePdfIcon />
				</Attachment.Media>
				<Attachment.Content>
					<Attachment.Title>annual-report.pdf</Attachment.Title>
					<Attachment.Description>Upload failed</Attachment.Description>
				</Attachment.Content>
				<Attachment.Actions>
					<Attachment.Action aria-label="Remove annual-report.pdf">
						<XIcon />
					</Attachment.Action>
				</Attachment.Actions>
			</Attachment.Root>
		</div>
	);
}
