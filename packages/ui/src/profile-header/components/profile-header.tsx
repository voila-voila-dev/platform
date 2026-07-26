import { ProfileHeaderCover } from "#/profile-header/components/profile-header-cover.tsx";
import { ProfileHeaderRoot } from "#/profile-header/components/profile-header-root.tsx";

/**
 * The ProfileHeader parts as one namespace.
 */
export const ProfileHeader = {
	Root: ProfileHeaderRoot,
	Cover: ProfileHeaderCover,
};

export type { ProfileTheme } from "#/profile-header/components/profile-header-theme.ts";
