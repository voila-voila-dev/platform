import { sankey as sankeyLayout, sankeyLinkHorizontal } from "d3-sankey";
import { markId } from "#/core/marks/shared.ts";
import type { ChartMark, ChartPoint, SceneNode } from "#/core/types.ts";

export interface SankeyNode {
	readonly id: string;
	/** Display name. Defaults to the id. */
	readonly label?: string;
}

export interface SankeyLink {
	readonly source: string;
	readonly target: string;
	readonly value: number;
}

export interface SankeyOptions {
	readonly id?: string;
	readonly nodeWidth?: number;
	readonly nodePadding?: number;
	/** What the flows are, for the table heading. */
	readonly label?: string;
	readonly tip?: boolean;
}

interface LaidNode extends SankeyNode {
	x0?: number;
	x1?: number;
	y0?: number;
	y1?: number;
	value?: number;
}

interface LaidLink {
	source: LaidNode;
	target: LaidNode;
	value: number;
	width?: number;
	y0?: number;
	y1?: number;
}

const LABEL_GAP = 6;

/**
 * Flows between stages: each node as tall as what passes through it, each
 * link as wide as its flow. Nodes and links are both focusable, so the
 * keyboard reaches "Inscriptions → Missions: 240" as well as each stage.
 */
export function sankey(
	data: {
		readonly nodes: ReadonlyArray<SankeyNode>;
		readonly links: ReadonlyArray<SankeyLink>;
	},
	options: SankeyOptions = {},
): ChartMark {
	const names = new Map(
		data.nodes.map((node) => [node.id, node.label ?? node.id]),
	);
	return {
		id: options.id,
		coordinate: "frame",
		focusOrder: "point",
		titles: { value: options.label },
		channels: {
			color: { values: data.nodes.map((node) => node.label ?? node.id) },
		},
		colorLegend: false,
		render(context) {
			const id = markId(options.id, "sankey", context);
			const { plot, theme, measureText } = context;
			const widest = Math.max(
				0,
				...[...names.values()].map((name) => measureText(name, theme.fontSize)),
			);
			const layout = sankeyLayout<LaidNode, LaidLink>()
				.nodeId((node) => node.id)
				.nodeWidth(options.nodeWidth ?? 12)
				.nodePadding(options.nodePadding ?? 12)
				.extent([
					[plot.x, plot.y],
					[plot.x + plot.width - widest - LABEL_GAP, plot.y + plot.height],
				]);
			const graph = layout({
				nodes: data.nodes.map((node) => ({ ...node })),
				links: data.links.map((link) => ({ ...link })) as unknown as LaidLink[],
			});
			const path = sankeyLinkHorizontal<LaidNode, LaidLink>();
			const nodes: SceneNode[] = [];
			const points: ChartPoint[] = [];
			for (const [index, link] of graph.links.entries()) {
				const from = names.get(link.source.id) ?? link.source.id;
				const to = names.get(link.target.id) ?? link.target.id;
				nodes.push({
					kind: "path",
					key: `${id}:link:${link.source.id}:${link.target.id}`,
					series: from,
					role: "mark",
					d: path(link as never) ?? "",
					paint: {
						fill: "none",
						stroke: context.colorOf(from),
						strokeOpacity: 0.35,
						strokeWidth: Math.max(1, link.width ?? 1),
					},
				});
				if (options.tip !== false) {
					points.push({
						key: `${id}:link:${link.source.id}:${link.target.id}`,
						markId: id,
						index,
						datum: link,
						x: ((link.source.x1 ?? 0) + (link.target.x0 ?? 0)) / 2,
						y: ((link.y0 ?? 0) + (link.y1 ?? 0)) / 2,
						xValue: `${from} → ${to}`,
						yValue: link.value,
						seriesLabel: options.label,
						color: context.colorOf(from),
						title: `${from} → ${to}`,
						value: context.formatY(link.value),
					});
				}
			}
			for (const [index, node] of graph.nodes.entries()) {
				const name = names.get(node.id) ?? node.id;
				const rect = {
					x: node.x0 ?? 0,
					y: node.y0 ?? 0,
					width: (node.x1 ?? 0) - (node.x0 ?? 0),
					height: Math.max(1, (node.y1 ?? 0) - (node.y0 ?? 0)),
				};
				nodes.push(
					{
						kind: "rect",
						key: `${id}:node:${node.id}`,
						series: name,
						role: "mark",
						...rect,
						paint: { fill: context.colorOf(name) },
					},
					{
						kind: "text",
						key: `${id}:label:${node.id}`,
						role: "label",
						x: rect.x + rect.width + LABEL_GAP,
						y: rect.y + rect.height / 2,
						text: name,
						paint: {
							fill: theme.foreground,
							fontSize: theme.fontSize,
							baseline: "middle",
						},
					},
				);
				if (options.tip !== false) {
					points.push({
						key: `${id}:node:${node.id}`,
						markId: id,
						index: graph.links.length + index,
						datum: node,
						x: rect.x + rect.width / 2,
						y: rect.y + rect.height / 2,
						xValue: name,
						yValue: node.value ?? 0,
						seriesLabel: options.label,
						color: context.colorOf(name),
						title: name,
						value: context.formatY(node.value ?? 0),
						hit: {
							kind: "rect",
							rect: { ...rect, x: rect.x - 4, width: rect.width + 8 },
						},
					});
				}
			}
			return { nodes, points };
		},
	};
}
