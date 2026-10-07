import {
	forceCenter,
	forceCollide,
	forceLink,
	forceManyBody,
	forceSimulation,
	forceX,
	forceY,
	type SimulationLinkDatum,
	type SimulationNodeDatum,
} from "d3-force";
import { markId } from "#/core/marks/shared.ts";
import type { ChartMark, ChartPoint, SceneNode } from "#/core/types.ts";

export interface ForceNode {
	readonly id: string;
	readonly label?: string;
	/** Colour group. */
	readonly group?: string;
}

export interface ForceLink {
	readonly source: string;
	readonly target: string;
}

export interface ForceOptions {
	readonly id?: string;
	readonly radius?: number;
	/** Settling steps. More is tidier and slower. */
	readonly ticks?: number;
	readonly labels?: boolean;
	readonly tip?: boolean;
}

interface SimulatedNode extends SimulationNodeDatum, ForceNode {}

const DEFAULT_RADIUS = 5;
const DEFAULT_TICKS = 300;

/** A fixed-seed random stream: the same graph settles the same way on the server and in the browser. */
function seeded(seed: number): () => number {
	let state = seed;
	return () => {
		state = (state * 1664525 + 1013904223) % 4294967296;
		return state / 4294967296;
	};
}

/**
 * A network laid out by forces: linked nodes pull together, all nodes push
 * apart. The simulation runs to rest before drawing, with a fixed seed, so
 * the picture is the same every time; a reader moves through the nodes with
 * the keyboard, each announced with how many links it has.
 */
export function forceGraph(
	data: {
		readonly nodes: ReadonlyArray<ForceNode>;
		readonly links: ReadonlyArray<ForceLink>;
	},
	options: ForceOptions = {},
): ChartMark {
	const groups = data.nodes.map((node) => node.group ?? "");
	return {
		id: options.id,
		coordinate: "frame",
		focusOrder: "point",
		channels: groups.some((group) => group !== "")
			? { color: { values: groups.filter((group) => group !== "") } }
			: {},
		render(context) {
			const id = markId(options.id, "force", context);
			const { plot, theme } = context;
			const radius = options.radius ?? DEFAULT_RADIUS;
			const simulated: SimulatedNode[] = data.nodes.map((node) => ({
				...node,
			}));
			const links = data.links.map((link) => ({
				...link,
			})) as SimulationLinkDatum<SimulatedNode>[];
			const simulation = forceSimulation(simulated)
				.randomSource(seeded(1))
				.force(
					"link",
					forceLink<SimulatedNode, SimulationLinkDatum<SimulatedNode>>(links)
						.id((node) => node.id)
						.distance(radius * 10),
				)
				.force("charge", forceManyBody().strength(-radius * 20))
				.force("collide", forceCollide(radius * 3))
				.force("center", forceCenter(0, 0))
				// A gentle pull to the middle keeps separate groups on one picture.
				.force("x", forceX(0).strength(0.08))
				.force("y", forceY(0).strength(0.08))
				.stop();
			simulation.tick(options.ticks ?? DEFAULT_TICKS);
			const xs = simulated.map((node) => node.x ?? 0);
			const ys = simulated.map((node) => node.y ?? 0);
			const [minX, maxX, minY, maxY] = [
				Math.min(...xs),
				Math.max(...xs),
				Math.min(...ys),
				Math.max(...ys),
			];
			const pad = radius * 2;
			const scale = Math.min(
				(plot.width - pad * 2) / Math.max(1, maxX - minX),
				(plot.height - pad * 2) / Math.max(1, maxY - minY),
				1.5,
			);
			const place = (node: SimulatedNode) => ({
				x:
					plot.x + plot.width / 2 + ((node.x ?? 0) - (minX + maxX) / 2) * scale,
				y:
					plot.y +
					plot.height / 2 +
					((node.y ?? 0) - (minY + maxY) / 2) * scale,
			});
			const degree = new Map<string, number>();
			const nodes: SceneNode[] = [];
			for (const link of links) {
				const source = link.source as SimulatedNode;
				const target = link.target as SimulatedNode;
				degree.set(source.id, (degree.get(source.id) ?? 0) + 1);
				degree.set(target.id, (degree.get(target.id) ?? 0) + 1);
				const from = place(source);
				const to = place(target);
				nodes.push({
					kind: "line",
					key: `${id}:link:${source.id}:${target.id}`,
					role: "grid",
					x1: from.x,
					y1: from.y,
					x2: to.x,
					y2: to.y,
					paint: { stroke: theme.grid, strokeWidth: 1.5 },
				});
			}
			const points: ChartPoint[] = [];
			for (const [index, node] of simulated.entries()) {
				const at = place(node);
				const color = node.group
					? context.colorOf(node.group)
					: context.paletteColor(0);
				nodes.push({
					kind: "circle",
					key: `${id}:${node.id}`,
					series: node.group,
					role: "mark",
					cx: at.x,
					cy: at.y,
					r: radius,
					paint: { fill: color, stroke: theme.background, strokeWidth: 1.5 },
				});
				if (options.labels) {
					nodes.push({
						kind: "text",
						key: `${id}:label:${node.id}`,
						role: "label",
						x: at.x + radius + 3,
						y: at.y,
						text: node.label ?? node.id,
						paint: {
							fill: theme.foreground,
							fontSize: theme.fontSize - 1,
							baseline: "middle",
						},
					});
				}
				if (options.tip !== false) {
					points.push({
						key: `${id}:${node.id}`,
						markId: id,
						index,
						datum: node,
						x: at.x,
						y: at.y,
						xValue: node.label ?? node.id,
						yValue: degree.get(node.id) ?? 0,
						series: node.group,
						seriesLabel: node.group,
						color,
						title: node.label ?? node.id,
						value: context.formatY(degree.get(node.id) ?? 0),
						hit: {
							kind: "rect",
							rect: {
								x: at.x - radius - 2,
								y: at.y - radius - 2,
								width: radius * 2 + 4,
								height: radius * 2 + 4,
							},
						},
					});
				}
			}
			return { nodes, points };
		},
	};
}
