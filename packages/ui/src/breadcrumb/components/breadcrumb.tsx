import { BreadcrumbEllipsis } from "#/breadcrumb/components/breadcrumb-ellipsis.tsx";
import { BreadcrumbItem } from "#/breadcrumb/components/breadcrumb-item.tsx";
import { BreadcrumbLink } from "#/breadcrumb/components/breadcrumb-link.tsx";
import { BreadcrumbList } from "#/breadcrumb/components/breadcrumb-list.tsx";
import { BreadcrumbPage } from "#/breadcrumb/components/breadcrumb-page.tsx";
import { BreadcrumbRoot } from "#/breadcrumb/components/breadcrumb-root.tsx";
import { BreadcrumbSeparator } from "#/breadcrumb/components/breadcrumb-separator.tsx";

/**
 * The Breadcrumb parts as one namespace.
 */
export const Breadcrumb = {
	Root: BreadcrumbRoot,
	Ellipsis: BreadcrumbEllipsis,
	Item: BreadcrumbItem,
	Link: BreadcrumbLink,
	List: BreadcrumbList,
	Page: BreadcrumbPage,
	Separator: BreadcrumbSeparator,
};
