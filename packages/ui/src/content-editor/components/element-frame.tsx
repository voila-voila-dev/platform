import { PlateElement, type PlateElementProps } from "platejs/react";
import type { ComponentType } from "react";
import { VoidFrame } from "#/content-editor/components/void-frame.tsx";
import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type {
	ContentElementKind,
	ContentElementViewProps,
} from "#/content-editor/lib/define-element-feature.ts";

interface Props<Node extends ContentNodeLike> {
	readonly plate: PlateElementProps;
	readonly kind: ContentElementKind;
	readonly inline: boolean;
	readonly node: Node;
	readonly view: ComponentType<ContentElementViewProps<Node>>;
}

/**
 * What every defined element draws on the canvas. A void shows its view as
 * a non-editable preview inside the `VoidFrame` every void shares, which
 * rings it while selected; a text element or a container hands the view its
 * editable children.
 */
export function ElementFrame<Node extends ContentNodeLike>({
	plate,
	kind,
	inline,
	node,
	view: View,
}: Props<Node>) {
	const as = inline ? "span" : "div";
	if (kind !== "void") {
		return (
			<PlateElement {...plate} as={as}>
				<View node={node}>{plate.children}</View>
			</PlateElement>
		);
	}
	return (
		<PlateElement {...plate} as={as}>
			<VoidFrame inline={inline}>
				<View node={node} />
			</VoidFrame>
			{plate.children}
		</PlateElement>
	);
}
