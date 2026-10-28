import { PageHeaderLead } from "#/components/page-header/lead.tsx";
import { PageHeaderRoot } from "#/components/page-header/root.tsx";
import { PageHeaderTitle } from "#/components/page-header/title.tsx";

/** Compose: `Root > Title + Lead`. */
export const PageHeader = {
	Root: PageHeaderRoot,
	Title: PageHeaderTitle,
	Lead: PageHeaderLead,
};
