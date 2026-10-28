import { VideoIcon } from "@phosphor-icons/react";
import { PlateElement, type PlateElementProps } from "platejs/react";
import { Button } from "#/button/components/button.tsx";
import { NodeFieldsPopover } from "#/content-editor/components/node-fields-popover.tsx";
import { VoidCaption } from "#/content-editor/components/void-caption.tsx";
import {
	VoidEmpty,
	VoidFrame,
} from "#/content-editor/components/void-frame.tsx";
import { useContentEditorLabels } from "#/content-editor/context/content-editor-context.tsx";
import type { ContentVideoNode } from "#/content-editor/features/video/reader.tsx";

export function VideoElement(props: PlateElementProps) {
	const labels = useContentEditorLabels();
	const node = props.element as unknown as ContentVideoNode;
	const edit = (trigger: React.ReactElement) => (
		<NodeFieldsPopover
			element={node}
			trigger={trigger}
			fields={[
				{
					key: "url",
					label: labels.chrome.url,
					placeholder: labels.chrome.urlPlaceholder,
					type: "url",
				},
			]}
			parse={(values) => {
				const url = (values.url ?? "").trim();
				return url === "" ? null : { url };
			}}
		/>
	);
	return (
		<PlateElement {...props}>
			<VoidFrame>
				{node.url ? (
					// biome-ignore lint/a11y/useMediaCaption: the caption below is the caption
					<video
						src={node.url}
						controls
						className="w-full rounded-xl border border-border bg-muted"
					/>
				) : (
					edit(
						<VoidEmpty className="cursor-pointer">
							<VideoIcon aria-hidden />
							{labels.items.video}
						</VoidEmpty>,
					)
				)}
				<div className="flex items-center justify-between gap-2">
					<VoidCaption element={node} caption={node.caption} />
					{node.url
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
