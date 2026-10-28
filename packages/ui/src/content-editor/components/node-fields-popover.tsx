import { useEditorRef } from "platejs/react";
import { type ReactElement, useState } from "react";
import { Button } from "#/button/components/button.tsx";
import { useContentEditorLabels } from "#/content-editor/context/content-editor-context.tsx";
import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import { Input } from "#/input/components/input.tsx";
import { Popover } from "#/popover/components/popover.tsx";

export interface NodeField {
	readonly key: string;
	readonly label: string;
	readonly placeholder?: string;
	readonly type?: "text" | "url";
}

interface Props {
	readonly element: ContentNodeLike;
	readonly trigger: ReactElement;
	readonly fields: ReadonlyArray<NodeField>;
	/** Turns the typed values into the node's attributes, or null to refuse. */
	readonly parse: (
		values: Readonly<Record<string, string>>,
	) => Record<string, unknown> | null;
}

/**
 * The small form a void element edits its attributes with, in place of the
 * source editor's window.prompt: one input per field, applied together.
 */
export function NodeFieldsPopover({ element, trigger, fields, parse }: Props) {
	const editor = useEditorRef();
	const labels = useContentEditorLabels();
	const [open, setOpen] = useState(false);
	const [values, setValues] = useState<Record<string, string>>({});
	const [invalid, setInvalid] = useState(false);

	return (
		<Popover.Root
			open={open}
			onOpenChange={(next) => {
				if (next) {
					setValues(
						Object.fromEntries(
							fields.map((field) => [
								field.key,
								String(element[field.key] ?? ""),
							]),
						),
					);
					setInvalid(false);
				}
				setOpen(next);
			}}
		>
			<Popover.Trigger render={trigger} />
			<Popover.Content
				side="bottom"
				align="start"
				className="w-[min(20rem,calc(100vw-2rem))] p-3"
			>
				<form
					className="flex flex-col gap-2"
					onSubmit={(event) => {
						event.preventDefault();
						const attributes = parse(values);
						if (attributes === null) {
							setInvalid(true);
							return;
						}
						const path = editor.api.findPath(element as never);
						if (path !== undefined) {
							editor.tf.setNodes(attributes as never, { at: path });
						}
						setOpen(false);
					}}
				>
					{fields.map((field, index) => (
						<Input
							key={field.key}
							type={field.type ?? "text"}
							aria-label={field.label}
							placeholder={field.placeholder}
							value={values[field.key] ?? ""}
							onChange={(event) =>
								setValues((current) => ({
									...current,
									[field.key]: event.target.value,
								}))
							}
							autoFocus={index === 0}
						/>
					))}
					{invalid ? (
						<p className="text-destructive text-xs">
							{labels.chrome.invalidEmbed}
						</p>
					) : null}
					<div className="flex items-center justify-between gap-2">
						<Button type="submit" size="sm">
							{labels.chrome.apply}
						</Button>
					</div>
				</form>
			</Popover.Content>
		</Popover.Root>
	);
}
