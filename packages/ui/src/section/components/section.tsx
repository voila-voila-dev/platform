import { SectionActions } from "#/section/components/section-actions.tsx";
import { SectionDescription } from "#/section/components/section-description.tsx";
import { SectionHeader } from "#/section/components/section-header.tsx";
import { SectionHeading } from "#/section/components/section-heading.tsx";
import { SectionRoot } from "#/section/components/section-root.tsx";
import { SectionTitle } from "#/section/components/section-title.tsx";

/**
 * The Section parts as one namespace.
 */
export const Section = {
	Root: SectionRoot,
	Actions: SectionActions,
	Description: SectionDescription,
	Header: SectionHeader,
	Heading: SectionHeading,
	Title: SectionTitle,
};
