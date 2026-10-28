import { PaperclipIcon } from "@phosphor-icons/react";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { Button } from "#/button/components/button.tsx";
import { NodeFieldsPopover } from "#/content-editor/components/node-fields-popover.tsx";
import { VoidCaption } from "#/content-editor/components/void-caption.tsx";
import { VoidFrame } from "#/content-editor/components/void-frame.tsx";
import { useContentEditorLabels } from "#/content-editor/context/content-editor-context.tsx";
import type { ContentFileNode } from "#/content-editor/features/file/reader.tsx";

export function FileElement(props: PlateElementProps) {
	const labels = useContentEditorLabels();
	const node = props.element as unknown as ContentFileNode;
	return (
		<PlateElement {...props}>
			<VoidFrame>
				<div className="flex items-center gap-3 rounded-md border border-border bg-muted/40 px-3 py-2">
					<PaperclipIcon
						aria-hidden
						className="shrink-0 text-muted-foreground"
					/>
					<div className="flex min-w-0 flex-1 flex-col">
						<span className="truncate text-sm">
							{node.name || labels.items.file}
						</span>
						<span className="truncate text-muted-foreground text-xs">
							{node.url}
						</span>
					</div>
					<NodeFieldsPopover
						element={node}
						trigger={
							<Button type="button" variant="ghost" size="xs">
								{labels.chrome.edit}
							</Button>
						}
						fields={[
							{ key: "name", label: labels.chrome.name },
							{
								key: "url",
								label: labels.chrome.url,
								placeholder: labels.chrome.urlPlaceholder,
								type: "url",
							},
						]}
						parse={(values) => {
							const url = (values.url ?? "").trim();
							const name = (values.name ?? "").trim();
							return url === ""
								? null
								: { url, name: name === "" ? url : name };
						}}
					/>
				</div>
				<VoidCaption element={node} caption={node.caption} />
			</VoidFrame>
			{props.children}
		</PlateElement>
	);
}
