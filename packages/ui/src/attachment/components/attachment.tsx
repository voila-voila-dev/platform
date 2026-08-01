import { AttachmentAction } from "#/attachment/components/attachment-action.tsx";
import { AttachmentActions } from "#/attachment/components/attachment-actions.tsx";
import { AttachmentContent } from "#/attachment/components/attachment-content.tsx";
import { AttachmentDescription } from "#/attachment/components/attachment-description.tsx";
import { AttachmentGroup } from "#/attachment/components/attachment-group.tsx";
import { AttachmentMedia } from "#/attachment/components/attachment-media.tsx";
import { AttachmentRoot } from "#/attachment/components/attachment-root.tsx";
import { AttachmentTitle } from "#/attachment/components/attachment-title.tsx";
import { AttachmentTrigger } from "#/attachment/components/attachment-trigger.tsx";

/**
 * The Attachment parts as one namespace.
 */
export const Attachment = {
	Root: AttachmentRoot,
	Action: AttachmentAction,
	Actions: AttachmentActions,
	Content: AttachmentContent,
	Description: AttachmentDescription,
	Group: AttachmentGroup,
	Media: AttachmentMedia,
	Title: AttachmentTitle,
	Trigger: AttachmentTrigger,
};
