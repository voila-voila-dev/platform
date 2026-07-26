import { ListMagnifyingGlassIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { Empty } from "#/empty/components/empty.tsx";

interface Props extends React.ComponentProps<typeof Empty.Root> {
	title?: string;
	description?: string;
}

/** The generic "nothing matched" block shown in place of rows. */
export function DataTableEmpty({
	title = "No results",
	description = "Try adjusting your search or filters.",
	...props
}: Props) {
	return (
		<Empty.Root className="py-8" {...props}>
			<Empty.Header>
				<Empty.Media variant="icon">
					<ListMagnifyingGlassIcon />
				</Empty.Media>
				<Empty.Title>{title}</Empty.Title>
				<Empty.Description>{description}</Empty.Description>
			</Empty.Header>
		</Empty.Root>
	);
}
