import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { Button } from "#/button/components/button.tsx";
import {
	PAGINATION_ELLIPSIS,
	usePagination,
} from "#/data-table/hooks/use-pagination.ts";
import { cn } from "#/lib/utils.ts";
import { Pagination } from "#/pagination/components/pagination.tsx";

interface Props extends Omit<React.ComponentProps<"div">, "children"> {
	/** Zero-based page index. */
	page: number;
	/** Rows per page. Used with `total` to compute the page count and the range line. */
	pageSize: number;
	/** Total number of rows across all pages (server-side count). */
	total: number;
	/** Called with the new zero-based index. This footer holds no state of its own. */
	onPageChange: (page: number) => void;
	/** Pages shown on each side of the current page (windowed with ellipses). */
	siblingCount?: number;
	/** Label for the previous-page control. This package ships no translations. */
	previousText?: string;
	/** Label for the next-page control. */
	nextText?: string;
	/** Localizable "1-10 of 42" range line; receives 1-based row positions. */
	rangeText?: (range: {
		from: number;
		to: number;
		total: number;
	}) => React.ReactNode;
	/** Localizable aria-label for a page button; receives the 1-based number. */
	pageLabel?: (pageNumber: number) => string;
}

/**
 * Pagination footer: row range on the left, windowed page numbers (hidden on
 * mobile) with previous/next on the right. State-driven (`onPageChange`)
 * rather than link-driven - for URL-backed pagination use the `Pagination`
 * components directly.
 */
export function DataTablePagination({
	page,
	pageSize,
	total,
	onPageChange,
	siblingCount = 1,
	previousText = "Previous",
	nextText = "Next",
	rangeText = ({ from, to, total: totalRows }) =>
		`${from}-${to} of ${totalRows}`,
	pageLabel = (pageNumber) => `Go to page ${pageNumber}`,
	className,
	...props
}: Props) {
	const pageCount = Math.max(1, Math.ceil(total / pageSize));
	const from = total === 0 ? 0 : page * pageSize + 1;
	const to = Math.min(total, (page + 1) * pageSize);
	const items = usePagination({ page, pageCount, siblingCount });

	return (
		<div
			data-slot="data-table-pagination"
			className={cn(
				"flex items-center justify-between gap-4 px-1 pt-3",
				className,
			)}
			{...props}
		>
			<span className="text-muted-foreground text-sm">
				{rangeText({ from, to, total })}
			</span>
			{pageCount > 1 && (
				<div className="flex items-center gap-1">
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={page === 0}
						aria-label={previousText}
						onClick={() => onPageChange(page - 1)}
					>
						<CaretLeftIcon data-icon="inline-start" />
						<span className="hidden sm:inline">{previousText}</span>
					</Button>
					<div className="hidden items-center gap-0.5 sm:flex">
						{items.map((item, index) =>
							item === PAGINATION_ELLIPSIS ? (
								// At most two ellipses; the position in the row identifies them.
								<Pagination.Ellipsis
									key={`ellipsis-${index}`}
									className="size-7"
								/>
							) : (
								<Button
									key={item}
									type="button"
									variant={item === page ? "outline" : "ghost"}
									size="icon-sm"
									aria-label={pageLabel(item + 1)}
									aria-current={item === page ? "page" : undefined}
									onClick={() => onPageChange(item)}
								>
									{item + 1}
								</Button>
							),
						)}
					</div>
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={page >= pageCount - 1}
						aria-label={nextText}
						onClick={() => onPageChange(page + 1)}
					>
						<span className="hidden sm:inline">{nextText}</span>
						<CaretRightIcon data-icon="inline-end" />
					</Button>
				</div>
			)}
		</div>
	);
}
