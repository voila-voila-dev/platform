import type * as React from "react";
import { Select } from "#/select/components/select.tsx";

interface Props extends React.ComponentProps<typeof Select.Label> {}

export function ResponsiveSelectLabel(props: Props) {
	return <Select.Label {...props} />;
}
