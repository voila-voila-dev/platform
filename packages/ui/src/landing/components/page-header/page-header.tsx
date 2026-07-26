import { PageHeaderLead } from "#/landing/components/page-header/lead.tsx";
import { PageHeaderRoot } from "#/landing/components/page-header/root.tsx";
import { PageHeaderTitle } from "#/landing/components/page-header/title.tsx";

/** Compose: `Root > Title + Lead`. */
export const PageHeader = {
	Root: PageHeaderRoot,
	Title: PageHeaderTitle,
	Lead: PageHeaderLead,
};
