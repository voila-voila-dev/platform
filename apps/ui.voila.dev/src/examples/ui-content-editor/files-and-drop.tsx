import { FileIcon, PaperclipIcon, XIcon } from "@phosphor-icons/react";
import { Attachment } from "@voila.dev/ui/attachment";
import { Button } from "@voila.dev/ui/button";
import {
	ContentEditor,
	type ContentValue,
	createContentFeatures,
} from "@voila.dev/ui/content-editor";
import { useRef, useState } from "react";
import { fakeUploadImage } from "./fixtures";

// Built once, outside the component: the editor's configuration, not its state.
const FEATURES = createContentFeatures();

const draft: ContentValue = [
	{ type: "p", children: [{ text: "Hello Camille," }] },
	{
		type: "p",
		children: [
			{
				text: "Drop a PDF anywhere on this card and it joins the attachments below. Drop a photo and it lands in the text.",
			},
		],
	},
];

function sizeOf(file: File): string {
	return file.size < 1024 * 1024
		? `${Math.max(1, Math.round(file.size / 1024))} KB`
		: `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * A mail composer: the whole card is the drop target, images go inline
 * through `onUploadImage`, every other file lands in the host's tray.
 */
export function AttachmentsTray() {
	const [value, setValue] = useState<ContentValue | null>(draft);
	const [attachments, setAttachments] = useState<ReadonlyArray<File>>([]);
	const picker = useRef<HTMLInputElement>(null);
	const attach = (files: ReadonlyArray<File>) =>
		setAttachments((current) => [...current, ...files]);

	return (
		<ContentEditor.Root
			features={FEATURES}
			value={value}
			onChange={setValue}
			onUploadImage={fakeUploadImage}
			onDropFiles={attach}
		>
			<ContentEditor.DropZone className="flex max-w-2xl flex-col gap-2 rounded-xl border bg-card p-2">
				<ContentEditor.Layout>
					<ContentEditor.Toolbar />
					<ContentEditor.Canvas placeholder="Write your message…" />
				</ContentEditor.Layout>
				{attachments.length > 0 ? (
					<Attachment.Group className="px-1">
						{attachments.map((file, index) => (
							<Attachment.Root key={`${file.name}-${index}`} size="sm">
								<Attachment.Media>
									<FileIcon />
								</Attachment.Media>
								<Attachment.Content>
									<Attachment.Title>{file.name}</Attachment.Title>
									<Attachment.Description>
										{sizeOf(file)}
									</Attachment.Description>
								</Attachment.Content>
								<Attachment.Actions>
									<Attachment.Action
										aria-label={`Remove ${file.name}`}
										onClick={() =>
											setAttachments((current) =>
												current.filter((_, at) => at !== index),
											)
										}
									>
										<XIcon />
									</Attachment.Action>
								</Attachment.Actions>
							</Attachment.Root>
						))}
					</Attachment.Group>
				) : null}
				<div className="flex items-center justify-between border-t px-1 pt-2">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => picker.current?.click()}
					>
						<PaperclipIcon aria-hidden />
						Attach
					</Button>
					<input
						ref={picker}
						type="file"
						multiple
						className="hidden"
						onChange={(event) => {
							attach(Array.from(event.target.files ?? []));
							event.target.value = "";
						}}
					/>
					<Button type="button" size="sm">
						Send
					</Button>
				</div>
			</ContentEditor.DropZone>
			<ContentEditor.FloatingToolbar />
		</ContentEditor.Root>
	);
}
