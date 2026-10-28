import { XLogoIcon } from "@phosphor-icons/react";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { Button } from "#/button/components/button.tsx";
import { NodeFieldsPopover } from "#/content-editor/components/node-fields-popover.tsx";
import { VoidCaption } from "#/content-editor/components/void-caption.tsx";
import {
	VoidEmpty,
	VoidFrame,
} from "#/content-editor/components/void-frame.tsx";
import { useContentEditorLabels } from "#/content-editor/context/content-editor-context.tsx";
import {
	type ContentXPostNode,
	xPostUrl,
} from "#/content-editor/features/x-post/reader.tsx";
import { xPostIdFrom } from "#/content-editor/lib/embeds.ts";

export function XPostElement(props: PlateElementProps) {
	const labels = useContentEditorLabels();
	const node = props.element as unknown as ContentXPostNode;
	const edit = (trigger: React.ReactElement) => (
		<NodeFieldsPopover
			element={node}
			trigger={trigger}
			fields={[
				{
					key: "postId",
					label: labels.chrome.url,
					placeholder: labels.chrome.urlPlaceholder,
				},
			]}
			parse={(values) => {
				const postId = xPostIdFrom(values.postId ?? "");
				return postId === null ? null : { postId };
			}}
		/>
	);
	return (
		<PlateElement {...props}>
			<VoidFrame>
				{node.postId ? (
					<div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
						<XLogoIcon aria-hidden />
						<span className="truncate">{xPostUrl(node.postId)}</span>
					</div>
				) : (
					edit(
						<VoidEmpty className="cursor-pointer">
							<XLogoIcon aria-hidden />
							{labels.items.xPost}
						</VoidEmpty>,
					)
				)}
				<div className="flex items-center justify-between gap-2">
					<VoidCaption element={node} caption={node.caption} />
					{node.postId
						? edit(
								<Button type="button" variant="ghost" size="xs">
									{labels.chrome.edit}
								</Button>,
							)
						: null}
				</div>
			</VoidFrame>
			{props.children}
		</PlateElement>
	);
}
