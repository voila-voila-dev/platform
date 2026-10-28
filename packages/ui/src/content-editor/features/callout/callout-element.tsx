import {
	PlateElement,
	type PlateElementProps,
	useEditorRef,
} from "platejs/react";
import { useState } from "react";
import { useContentEditorLabels } from "#/content-editor/context/content-editor-context.tsx";
import type { ContentCalloutNode } from "#/content-editor/features/callout/reader.tsx";
import { DEFAULT_CALLOUT_ICON } from "#/content-editor/features/callout/reader.tsx";
import { Popover } from "#/popover/components/popover.tsx";

const QUICK_ICONS = ["💡", "⚠️", "ℹ️", "✅", "❌", "📌", "🔥", "💬"];

export function CalloutElement(props: PlateElementProps) {
	const editor = useEditorRef();
	const labels = useContentEditorLabels();
	const node = props.element as unknown as ContentCalloutNode;
	const icon = node.icon ?? DEFAULT_CALLOUT_ICON;
	const [open, setOpen] = useState(false);

	const setIcon = (next: string) => {
		const path = editor.api.findPath(props.element);
		if (path !== undefined) {
			editor.tf.setNodes({ icon: next } as never, { at: path });
		}
		setOpen(false);
	};

	return (
		<PlateElement
			{...props}
			className="flex gap-3 rounded-md border border-border bg-muted/40 px-3 py-2"
		>
			<Popover.Root open={open} onOpenChange={setOpen}>
				<Popover.Trigger
					render={
						<button
							type="button"
							contentEditable={false}
							aria-label={labels.chrome.changeIcon}
							className="select-none text-lg leading-7 hover:opacity-80"
						>
							{icon}
						</button>
					}
				/>
				<Popover.Content side="bottom" align="start" className="w-auto p-2">
					<div className="grid grid-cols-4 gap-1">
						{QUICK_ICONS.map((candidate) => (
							<button
								key={candidate}
								type="button"
								aria-pressed={candidate === icon}
								onClick={() => setIcon(candidate)}
								className="rounded-md p-1 text-lg hover:bg-accent aria-pressed:bg-accent"
							>
								{candidate}
							</button>
						))}
					</div>
				</Popover.Content>
			</Popover.Root>
			<div className="min-w-0 flex-1">{props.children}</div>
		</PlateElement>
	);
}
