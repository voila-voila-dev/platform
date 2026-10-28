import { AvatarBadge } from "#/avatar/components/avatar-badge.tsx";
import { AvatarFallback } from "#/avatar/components/avatar-fallback.tsx";
import { AvatarGroup } from "#/avatar/components/avatar-group.tsx";
import { AvatarGroupCount } from "#/avatar/components/avatar-group-count.tsx";
import { AvatarImage } from "#/avatar/components/avatar-image.tsx";
import { AvatarRoot } from "#/avatar/components/avatar-root.tsx";

/**
 * The Avatar parts as one namespace.
 */
export const Avatar = {
	Root: AvatarRoot,
	Badge: AvatarBadge,
	Fallback: AvatarFallback,
	Group: AvatarGroup,
	GroupCount: AvatarGroupCount,
	Image: AvatarImage,
};
