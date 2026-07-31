import {
	EMAIL_COLOR,
	type EmailBlockComponentProps,
	type EmailEditorBlock,
	emailBlockDefinition,
} from "@voila.dev/ui/email-block-editor";
import { type ReactNode, useState } from "react";

/** Fake upload for the docs previews: no backend here, so the picked file is
 * served from an object URL — a real app returns the uploaded file's URL. */
export const fakeUploadImage = async (file: File) => {
	await new Promise((resolve) => setTimeout(resolve, 600));
	return URL.createObjectURL(file);
};

/** The 600px email card the blocks sit in inside the editor canvas. */
export function EmailCard({ children }: { children: ReactNode }) {
	return (
		<div
			className="flex w-full justify-center rounded-lg p-4"
			style={{ backgroundColor: EMAIL_COLOR.canvas }}
		>
			<div
				className="w-full max-w-[600px] rounded-[14px] border px-6 py-5"
				style={{
					backgroundColor: EMAIL_COLOR.card,
					borderColor: EMAIL_COLOR.border,
				}}
			>
				{children}
			</div>
		</div>
	);
}

/**
 * One block, editable in place, exactly as the canvas renders it. The block is
 * local state so the previews on the docs site are genuinely editable.
 */
export function Block({
	initial,
	onUploadImage,
}: {
	initial: EmailEditorBlock;
	onUploadImage?: EmailBlockComponentProps["onUploadImage"];
}) {
	const [block, setBlock] = useState(initial);
	const definition = emailBlockDefinition(block);
	return (
		<EmailCard>
			<definition.View
				block={block}
				selected={false}
				onChange={setBlock}
				onUploadImage={onUploadImage}
			/>
		</EmailCard>
	);
}
