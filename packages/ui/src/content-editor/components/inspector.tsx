import { useEditorRef } from "platejs/react";
import type * as React from "react";
import { useEffect, useRef } from "react";
import { InspectorField } from "#/content-editor/components/inspector-field.tsx";
import { useContentEditorConfig } from "#/content-editor/context/content-editor-context.tsx";
import { useInspectedElement } from "#/content-editor/hooks/use-inspected-element.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"section"> {}

/**
 * The fields of the element the selection sits in: a link, an image, any
 * element a feature declared fields for. Where it goes is the host's call:
 * a side panel beside the canvas, or a sheet on a phone, opened while
 * `useInspectedElement()` is not null.
 */
export function ContentEditorInspector({ className, ...props }: Props) {
	const editor = useEditorRef();
	const { labels, readOnly, popovers } = useContentEditorConfig();
	const inspected = useInspectedElement();
	const fields = useRef<HTMLFieldSetElement>(null);
	useEffect(
		() =>
			popovers.registerInspector(() => {
				const first = fields.current?.querySelector<HTMLElement>(
					"input, textarea, select, button",
				);
				// A sheet the host closed still has its inspector mounted.
				if (first === null || first === undefined || !first.checkVisibility()) {
					return false;
				}
				first.focus();
				if (first instanceof HTMLInputElement) {
					first.select();
				}
				return true;
			}),
		[popovers],
	);
	const name =
		inspected === null
			? labels.chrome.inspector
			: (labels.items[inspected.featureKey] ?? inspected.featureKey);

	return (
		<section
			data-slot="content-editor-inspector"
			aria-label={name}
			className={cn("flex flex-col gap-4", className)}
			{...props}
		>
			<h2 className="font-semibold text-base">{name}</h2>
			{inspected === null ? (
				<p className="text-muted-foreground text-sm">
					{labels.chrome.inspectorEmpty}
				</p>
			) : (
				<fieldset
					ref={fields}
					// A new element gets fresh controls: an upload in progress or a
					// half-typed value never carries over to the next one.
					key={inspected.identity}
					disabled={readOnly}
					// A fieldset is as wide as its widest line by default; a long
					// truncated value would push the panel wider than the host made it.
					className="flex min-w-0 flex-col gap-4"
					// Enter in a one-line field, or Escape, hands the caret back to
					// the text, as closing the link form does.
					onKeyDown={(event) => {
						const { target, key } = event;
						const inField =
							target instanceof HTMLInputElement ||
							target instanceof HTMLTextAreaElement;
						const leaves =
							key === "Escape" ||
							(key === "Enter" && target instanceof HTMLInputElement);
						if (inField && leaves) {
							event.preventDefault();
							editor.tf.focus();
						}
					}}
				>
					{inspected.fields.map((field) => (
						<InspectorField
							key={field.key}
							field={field}
							value={inspected.node[field.key]}
							onChange={(value) => inspected.set(field.key, value)}
						/>
					))}
					{inspected.section === undefined ? null : (
						<inspected.section node={inspected.node} />
					)}
				</fieldset>
			)}
		</section>
	);
}
