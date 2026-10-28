import { YoutubeLogoIcon } from "@phosphor-icons/react";
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
	type ContentYoutubeNode,
	youtubeEmbedUrl,
} from "#/content-editor/features/youtube/reader.tsx";
import { youtubeVideoIdFrom } from "#/content-editor/lib/embeds.ts";

export function YoutubeElement(props: PlateElementProps) {
	const labels = useContentEditorLabels();
	const node = props.element as unknown as ContentYoutubeNode;
	const edit = (trigger: React.ReactElement) => (
		<NodeFieldsPopover
			element={node}
			trigger={trigger}
			fields={[
				{
					key: "videoId",
					label: labels.chrome.url,
					placeholder: labels.chrome.urlPlaceholder,
				},
			]}
			parse={(values) => {
				const videoId = youtubeVideoIdFrom(values.videoId ?? "");
				return videoId === null ? null : { videoId };
			}}
		/>
	);
	return (
		<PlateElement {...props}>
			<VoidFrame>
				{node.videoId ? (
					<iframe
						title={node.caption ?? node.videoId}
						src={youtubeEmbedUrl(node.videoId)}
						loading="lazy"
						allowFullScreen
						className="pointer-events-none aspect-video w-full rounded-xl border border-border"
					/>
				) : (
					edit(
						<VoidEmpty className="cursor-pointer">
							<YoutubeLogoIcon aria-hidden />
							{labels.items.youtube}
						</VoidEmpty>,
					)
				)}
				<div className="flex items-center justify-between gap-2">
					<VoidCaption element={node} caption={node.caption} />
					{node.videoId
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
