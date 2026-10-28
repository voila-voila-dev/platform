import type * as React from "react";
import { Select } from "#/select/components/select.tsx";

interface Props extends React.ComponentProps<typeof Select.Group> {}

export function ResponsiveSelectGroup(props: Props) {
	return <Select.Group {...props} />;
}
