import type * as React from "react";
import { Select } from "#/select/components/select.tsx";

interface Props extends React.ComponentProps<typeof Select.Content> {}

export function ResponsiveSelectContent(props: Props) {
	return <Select.Content {...props} />;
}
