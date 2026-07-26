import type * as React from "react";
import { Select } from "#/select/components/select.tsx";

interface Props extends React.ComponentProps<typeof Select.Item> {}

export function ResponsiveSelectItem(props: Props) {
	return <Select.Item {...props} />;
}
