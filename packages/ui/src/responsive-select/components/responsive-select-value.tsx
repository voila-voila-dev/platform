import type * as React from "react";
import { Select } from "#/select/components/select.tsx";

interface Props extends React.ComponentProps<typeof Select.Value> {}

export function ResponsiveSelectValue(props: Props) {
	return <Select.Value {...props} />;
}
