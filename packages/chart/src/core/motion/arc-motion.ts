import { arcPath } from "#/core/paths.ts";
import type {
	GeometryMotion,
	GeometryPlan,
	SceneGeometry,
	SceneNode,
	ScenePath,
} from "#/core/types.ts";

type Arc = Extract<SceneGeometry, { kind: "arc" }>;

const ARC_FIELDS = [
	"cx",
	"cy",
	"innerRadius",
	"outerRadius",
	"startAngle",
	"endAngle",
] as const;

function arcOf(node: SceneNode | undefined): Arc | undefined {
	return node?.kind === "path" && node.geometry?.kind === "arc"
		? node.geometry
		: undefined;
}

/** Slices of one ring tile it: those are the neighbours a slice opens from and closes onto. */
function sameRing(a: Arc, b: Arc): boolean {
	return (
		a.cx === b.cx &&
		a.cy === b.cy &&
		a.innerRadius === b.innerRadius &&
		a.outerRadius === b.outerRadius
	);
}

function withAngle(node: ScenePath, arc: Arc, angle: number): ScenePath {
	return { ...node, geometry: { ...arc, startAngle: angle, endAngle: angle } };
}

/**
 * The boundary angle next to `node` among the slices of its ring in `order`,
 * read from `known`: the end of the nearest one before it, or the start of the
 * nearest one after it, whichever side `afterFirst` looks at first.
 */
function boundary(
	node: SceneNode,
	order: readonly SceneNode[],
	known: ReadonlyMap<string, SceneNode>,
	arc: Arc,
	afterFirst: boolean,
): number {
	const index = order.findIndex((other) => other.key === node.key);
	function scan(step: -1 | 1): number | undefined {
		for (let at = index + step; at >= 0 && at < order.length; at += step) {
			const other = arcOf(known.get((order[at] as SceneNode).key));
			if (other && sameRing(other, arc)) {
				return step === 1 ? other.startAngle : other.endAngle;
			}
		}
		return undefined;
	}
	const [first, second] = afterFirst ? ([1, -1] as const) : ([-1, 1] as const);
	return scan(first) ?? scan(second) ?? arc.startAngle;
}

function arcPlan(from: Arc, to: Arc): GeometryPlan {
	function record(arc: Arc) {
		return new Map<string, number>(
			ARC_FIELDS.map((field) => [field, arc[field]]),
		);
	}
	return {
		starts: record(from),
		targets: record(to),
		build(value) {
			const arc = { kind: "arc" } as Record<string, unknown>;
			for (const field of ARC_FIELDS) arc[field] = value(field);
			return arc as Arc;
		},
	};
}

/**
 * Slices and radial bars: their angles and radii move, and the arc is
 * rebuilt each frame, so its large-arc flag is never wrong. A new slice opens
 * from the boundary where it will sit; a removed one closes onto the slice
 * after it.
 */
export const ARC_MOTION: GeometryMotion = {
	plan: (from, to) =>
		from.kind === "arc" && to.kind === "arc" ? arcPlan(from, to) : undefined,
	draw: (geometry) =>
		geometry.kind === "arc"
			? arcPath({
					...geometry,
					endAngle: Math.max(geometry.startAngle, geometry.endAngle),
				})
			: "",
	enter(node, siblings, before) {
		const arc = arcOf(node);
		return node.enter === "grow" && arc
			? withAngle(node, arc, boundary(node, siblings, before, arc, false))
			: undefined;
	},
	exit(node, siblings, after) {
		const arc = arcOf(node);
		// A slice closes onto the one after it, so it takes that one's new start.
		return node.enter === "grow" && arc
			? withAngle(node, arc, boundary(node, siblings, after, arc, true))
			: undefined;
	},
};
