import * as React from "react";
import { NativeSelect } from "#/native-select/components/native-select.tsx";
import type { SelectItemShape } from "#/responsive-select/components/responsive-select-children.ts";
import {
	getElementOfType,
	getElementsOfType,
	textOf,
} from "#/responsive-select/components/responsive-select-children.ts";
import { ResponsiveSelectGroup } from "#/responsive-select/components/responsive-select-group.tsx";
import { ResponsiveSelectItem } from "#/responsive-select/components/responsive-select-item.tsx";
import { ResponsiveSelectLabel } from "#/responsive-select/components/responsive-select-label.tsx";

interface Props {
	children: React.ReactNode;
}

export function NativeOptionsFromContent({ children }: Props) {
	return (
		<>
			{React.Children.map(children, (child) => {
				if (!React.isValidElement(child)) return null;
				if (child.type === ResponsiveSelectItem) {
					const props = child.props as SelectItemShape;
					return (
						<NativeSelect.Option value={props.value} disabled={props.disabled}>
							{props.children}
						</NativeSelect.Option>
					);
				}
				if (child.type === ResponsiveSelectGroup) {
					const groupChildren = (child.props as { children?: React.ReactNode })
						.children;
					const label = getElementOfType<{ children?: React.ReactNode }>(
						groupChildren,
						ResponsiveSelectLabel,
					);
					const items = getElementsOfType<SelectItemShape>(
						groupChildren,
						ResponsiveSelectItem,
					);
					return (
						<NativeSelect.OptGroup label={textOf(label?.props.children)}>
							{items.map((item) => (
								<NativeSelect.Option
									key={item.props.value}
									value={item.props.value}
									disabled={item.props.disabled}
								>
									{item.props.children}
								</NativeSelect.Option>
							))}
						</NativeSelect.OptGroup>
					);
				}
				return null;
			})}
		</>
	);
}
