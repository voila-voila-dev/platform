import { PaginationContent } from "#/pagination/components/pagination-content.tsx";
import { PaginationEllipsis } from "#/pagination/components/pagination-ellipsis.tsx";
import { PaginationItem } from "#/pagination/components/pagination-item.tsx";
import { PaginationLink } from "#/pagination/components/pagination-link.tsx";
import { PaginationNext } from "#/pagination/components/pagination-next.tsx";
import { PaginationPrevious } from "#/pagination/components/pagination-previous.tsx";
import { PaginationRoot } from "#/pagination/components/pagination-root.tsx";

/**
 * The Pagination parts as one namespace.
 */
export const Pagination = {
	Root: PaginationRoot,
	Content: PaginationContent,
	Ellipsis: PaginationEllipsis,
	Item: PaginationItem,
	Link: PaginationLink,
	Next: PaginationNext,
	Previous: PaginationPrevious,
};
