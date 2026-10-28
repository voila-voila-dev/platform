import {
	type HierarchyNode,
	type HierarchyRectangularNode,
	hierarchy,
	partition,
	tree,
	treemap,
} from "d3-hierarchy";
import { truncate } from "#/core/guides/axes.ts";
import { markId } from "#/core/marks/shared.ts";
import { arcPath, polarToCartesian } from "#/core/paths.ts";
import type {
	ChartMark,
	ChartMarkContext,
	ChartPoint,
	SceneNode,
} from "#/core/types.ts";

/**
 * Nested data: a treemap, a sunburst, a tree. Each takes one root and reads
 * its children, value and name through accessors, so any nested shape works.
 * Colours follow the root's direct children (the branches the legend lists);
 * deeper levels keep their branch's colour.
 */

export interface HierarchyOptions<TNode> {
	readonly id?: string;
	readonly children?: (node: TNode) => ReadonlyArray<TNode> | undefined;
	/** A leaf's size. Branches sum their leaves. */
	readonly value?: (node: TNode) => number;
	readonly name: (node: TNode) => string;
	/** What the values are, for the table heading. */
	readonly label?: string;
	readonly tip?: boolean;
}

function rooted<TNode>(
	root: TNode,
	options: HierarchyOptions<TNode>,
): HierarchyNode<TNode> {
	const node = hierarchy(
		root,
		(datum) =>
			(options.children?.(datum) as TNode[] | undefined) ??
			(datum as { children?: TNode[] }).children,
	);
	return node
		.sum((datum) => (options.value ? Math.max(0, options.value(datum)) : 0))
		.sort((left, right) => (right.value ?? 0) - (left.value ?? 0));
}

function branchOf<TNode>(node: HierarchyNode<TNode>): HierarchyNode<TNode> {
	let current = node;
	while (current.parent?.parent) {
		current = current.parent;
	}
	return current;
}

function pathName<TNode>(
	node: HierarchyNode<TNode>,
	options: HierarchyOptions<TNode>,
): string {
	return node
		.ancestors()
		.reverse()
		.slice(1)
		.map((ancestor) => options.name(ancestor.data))
		.join(" › ");
}

function branchNames<TNode>(
	root: TNode,
	options: HierarchyOptions<TNode>,
): string[] {
	return (rooted(root, options).children ?? []).map((child) =>
		options.name(child.data),
	);
}

function nodeKey<TNode>(
	node: HierarchyNode<TNode>,
	options: HierarchyOptions<TNode>,
): string {
	return node
		.ancestors()
		.map((ancestor) => options.name(ancestor.data))
		.reverse()
		.join("/");
}

function colorFor<TNode>(
	node: HierarchyNode<TNode>,
	options: HierarchyOptions<TNode>,
	context: ChartMarkContext,
): string {
	return node.depth === 0
		? context.theme.muted
		: context.colorOf(options.name(branchOf(node).data));
}

function pointFor<TNode>(
	id: string,
	node: HierarchyNode<TNode>,
	options: HierarchyOptions<TNode>,
	context: ChartMarkContext,
	index: number,
	at: { x: number; y: number },
	hit?: ChartPoint["hit"],
): ChartPoint {
	return {
		key: `${id}:${nodeKey(node, options)}`,
		markId: id,
		index,
		datum: node.data,
		x: at.x,
		y: at.y,
		xValue: options.name(node.data),
		yValue: node.value ?? 0,
		series: options.name(branchOf(node).data),
		seriesLabel: options.label,
		color: colorFor(node, options, context),
		title: pathName(node, options) || options.name(node.data),
		value: context.formatY(node.value ?? 0),
		hit,
	};
}

const LABEL_PADDING = 4;
const MIN_LABEL_HEIGHT = 16;

/** Rectangles nested inside rectangles, each leaf as large as its value. */
export function treemapMark<TNode>(
	root: TNode,
	options: HierarchyOptions<TNode>,
): ChartMark {
	return {
		id: options.id,
		coordinate: "frame",
		focusOrder: "point",
		titles: { value: options.label },
		channels: { color: { values: branchNames(root, options) } },
		render(context) {
			const id = markId(options.id, "treemap", context);
			const { plot, theme } = context;
			const laid = treemap<TNode>()
				.size([plot.width, plot.height])
				.paddingInner(2)
				.round(true)(rooted(root, options));
			const nodes: SceneNode[] = [];
			const points: ChartPoint[] = [];
			for (const [index, leaf] of laid.leaves().entries()) {
				const rect = {
					x: plot.x + leaf.x0,
					y: plot.y + leaf.y0,
					width: Math.max(0, leaf.x1 - leaf.x0),
					height: Math.max(0, leaf.y1 - leaf.y0),
				};
				const key = nodeKey(leaf, options);
				const series = options.name(branchOf(leaf).data);
				nodes.push({
					kind: "rect",
					key: `${id}:${key}`,
					series,
					role: "mark",
					...rect,
					corners: [3, 3, 3, 3],
					paint: {
						fill: colorFor(leaf, options, context),
						fillOpacity: 0.55 + 0.45 / leaf.depth,
					},
				});
				if (
					rect.height >= MIN_LABEL_HEIGHT &&
					rect.width > theme.fontSize * 2
				) {
					nodes.push({
						kind: "text",
						key: `${id}:label:${key}`,
						series,
						role: "label",
						x: rect.x + LABEL_PADDING,
						y: rect.y + LABEL_PADDING,
						text: truncate(
							options.name(leaf.data),
							rect.width - LABEL_PADDING * 2,
							theme.fontSize,
							context.measureText,
						),
						paint: {
							fill: theme.background,
							fontSize: theme.fontSize,
							fontWeight: 600,
							baseline: "top",
						},
					});
				}
				if (options.tip !== false) {
					points.push(
						pointFor(
							id,
							leaf,
							options,
							context,
							index,
							{ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 },
							{ kind: "rect", rect },
						),
					);
				}
			}
			return { nodes, points };
		},
	};
}

/** Rings of arcs: the root's children on the first ring, theirs on the next. */
export function sunburstMark<TNode>(
	root: TNode,
	options: HierarchyOptions<TNode>,
): ChartMark {
	return {
		id: options.id,
		coordinate: "frame",
		focusOrder: "point",
		titles: { value: options.label },
		channels: { color: { values: branchNames(root, options) } },
		render(context) {
			const id = markId(options.id, "sunburst", context);
			const { plot } = context;
			const radius = Math.max(0, Math.min(plot.width, plot.height) / 2 - 4);
			const cx = plot.x + plot.width / 2;
			const cy = plot.y + plot.height / 2;
			const laid = partition<TNode>().size([360, radius])(
				rooted(root, options),
			);
			// The root's ring would be a disc in the middle: leave it empty.
			const ringWidth = radius / (laid.height + 1);
			const nodes: SceneNode[] = [];
			const points: ChartPoint[] = [];
			const descendants = laid
				.descendants()
				.filter((node) => node.depth > 0 && node.x1 - node.x0 > 0.2);
			for (const [index, node] of descendants.entries()) {
				const shape = {
					cx,
					cy,
					innerRadius: node.depth * ringWidth,
					outerRadius: (node.depth + 1) * ringWidth - 1,
					startAngle: node.x0 + 0.25,
					endAngle: node.x1 - 0.25,
				};
				const series = options.name(branchOf(node).data);
				nodes.push({
					kind: "path",
					key: `${id}:${nodeKey(node, options)}`,
					series,
					role: "mark",
					d: arcPath(shape),
					paint: {
						fill: colorFor(node, options, context),
						fillOpacity: 1 - (node.depth - 1) * 0.18,
					},
				});
				if (options.tip !== false) {
					const anchor = polarToCartesian(
						cx,
						cy,
						(shape.innerRadius + shape.outerRadius) / 2,
						(shape.startAngle + shape.endAngle) / 2,
					);
					points.push(
						pointFor(id, node, options, context, index, anchor, {
							kind: "arc",
							...shape,
						}),
					);
				}
			}
			return { nodes, points };
		},
	};
}

const NODE_RADIUS = 4;
const LABEL_GAP = 6;

/** A node-link tree, root on the left, leaves on the right, every node named. */
export function treeMark<TNode>(
	root: TNode,
	options: HierarchyOptions<TNode>,
): ChartMark {
	return {
		id: options.id,
		coordinate: "frame",
		focusOrder: "point",
		titles: { value: options.label },
		channels: {},
		render(context) {
			const id = markId(options.id, "tree", context);
			const { plot, theme, measureText } = context;
			const rootNode = rooted(root, options);
			const leafLabel = Math.max(
				0,
				...rootNode
					.leaves()
					.map((leaf) => measureText(options.name(leaf.data), theme.fontSize)),
			);
			// The root's label sits left of it, the leaves' right of them: both inside the plot.
			const rootLabel =
				measureText(options.name(rootNode.data), theme.fontSize) + LABEL_GAP;
			const width = Math.max(
				0,
				plot.width - rootLabel - leafLabel - LABEL_GAP - NODE_RADIUS * 2,
			);
			const laid = tree<TNode>().size([plot.height, width])(
				rootNode,
			) as HierarchyRectangularNode<TNode> & HierarchyNode<TNode>;
			const position = (
				node: HierarchyNode<TNode> & { x?: number; y?: number },
			) => ({
				x: plot.x + rootLabel + NODE_RADIUS + (node.y ?? 0),
				y: plot.y + (node.x ?? 0),
			});
			const nodes: SceneNode[] = [];
			const points: ChartPoint[] = [];
			for (const link of laid.links()) {
				const from = position(link.source);
				const to = position(link.target);
				const middle = (from.x + to.x) / 2;
				nodes.push({
					kind: "path",
					key: `${id}:link:${nodeKey(link.target, options)}`,
					role: "grid",
					d: `M${from.x},${from.y}C${middle},${from.y} ${middle},${to.y} ${to.x},${to.y}`,
					paint: { fill: "none", stroke: theme.grid, strokeWidth: 1.5 },
				});
			}
			for (const [index, node] of laid.descendants().entries()) {
				const at = position(node);
				const leaf = node.children === undefined;
				nodes.push(
					{
						kind: "circle",
						key: `${id}:${nodeKey(node, options)}`,
						role: "mark",
						cx: at.x,
						cy: at.y,
						r: NODE_RADIUS,
						paint: {
							fill: leaf ? theme.background : colorFor(node, options, context),
							stroke: colorFor(node, options, context),
							strokeWidth: 1.5,
						},
					},
					{
						kind: "text",
						key: `${id}:label:${nodeKey(node, options)}`,
						role: "label",
						x:
							at.x +
							(leaf ? LABEL_GAP + NODE_RADIUS : -(LABEL_GAP + NODE_RADIUS)),
						y: at.y,
						text: options.name(node.data),
						paint: {
							fill: theme.foreground,
							fontSize: theme.fontSize,
							textAnchor: leaf ? "start" : "end",
							baseline: "middle",
						},
					},
				);
				if (options.tip !== false) {
					points.push(pointFor(id, node, options, context, index, at));
				}
			}
			return { nodes, points };
		},
	};
}
