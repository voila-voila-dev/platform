import { roundedBarPath } from "#/core/paths.ts";
import type { ChartPaint, ChartScene, SceneNode } from "#/core/types.ts";

const CANVAS_BASELINE = {
	top: "top",
	middle: "middle",
	bottom: "bottom",
	alphabetic: "alphabetic",
} as const satisfies Record<string, CanvasTextBaseline>;

const CANVAS_ALIGN = {
	start: "left",
	middle: "center",
	end: "right",
} as const satisfies Record<string, CanvasTextAlign>;

function dashes(dasharray: string | undefined): number[] {
	if (!dasharray) {
		return [];
	}
	return dasharray
		.split(/[\s,]+/)
		.map(Number)
		.filter((value) => Number.isFinite(value));
}

interface PaintEnvironment {
	readonly context: CanvasRenderingContext2D;
	readonly resolve: (color: string) => string;
	readonly fontFamily: string;
}

function fillAndStroke(
	environment: PaintEnvironment,
	paint: ChartPaint,
	draw: (mode: "fill" | "stroke") => void,
) {
	const { context, resolve } = environment;
	const opacity = paint.opacity ?? 1;
	if (paint.fill && paint.fill !== "none") {
		context.globalAlpha = opacity * (paint.fillOpacity ?? 1);
		context.fillStyle = resolve(paint.fill);
		draw("fill");
	}
	if (paint.stroke && paint.stroke !== "none") {
		context.globalAlpha = opacity * (paint.strokeOpacity ?? 1);
		context.strokeStyle = resolve(paint.stroke);
		context.lineWidth = paint.strokeWidth ?? 1;
		context.lineCap = paint.strokeLinecap ?? "butt";
		context.lineJoin = paint.strokeLinejoin ?? "miter";
		context.setLineDash(dashes(paint.strokeDasharray));
		draw("stroke");
		context.setLineDash([]);
	}
	context.globalAlpha = 1;
}

function paintNode(environment: PaintEnvironment, node: SceneNode) {
	const { context } = environment;
	switch (node.kind) {
		case "group":
			context.save();
			if (node.translate) {
				context.translate(node.translate.x, node.translate.y);
			}
			if (node.clip) {
				context.beginPath();
				context.rect(
					node.clip.x,
					node.clip.y,
					node.clip.width,
					node.clip.height,
				);
				context.clip();
			}
			for (const child of node.children) {
				paintNode(environment, child);
			}
			context.restore();
			return;
		case "rect": {
			const path = node.corners
				? new Path2D(roundedBarPath({ ...node, radius: node.corners }))
				: undefined;
			fillAndStroke(environment, node.paint, (mode) => {
				if (path) {
					context[mode](path);
				} else if (mode === "fill") {
					context.fillRect(node.x, node.y, node.width, node.height);
				} else {
					context.strokeRect(node.x, node.y, node.width, node.height);
				}
			});
			return;
		}
		case "path": {
			if (node.d === "") {
				return;
			}
			const path = new Path2D(node.d);
			fillAndStroke(environment, node.paint, (mode) => context[mode](path));
			return;
		}
		case "circle": {
			const path = new Path2D();
			path.arc(node.cx, node.cy, node.r, 0, Math.PI * 2);
			fillAndStroke(environment, node.paint, (mode) => context[mode](path));
			return;
		}
		case "line": {
			const path = new Path2D();
			path.moveTo(node.x1, node.y1);
			path.lineTo(node.x2, node.y2);
			fillAndStroke(environment, { ...node.paint, fill: undefined }, () =>
				context.stroke(path),
			);
			return;
		}
		case "text": {
			const { paint } = node;
			context.save();
			context.translate(node.x, node.y);
			if (node.rotate) {
				context.rotate((node.rotate * Math.PI) / 180);
			}
			context.font = `${paint.fontWeight ?? 400} ${paint.fontSize ?? 12}px ${environment.fontFamily}`;
			context.textAlign = CANVAS_ALIGN[paint.textAnchor ?? "start"];
			context.textBaseline = CANVAS_BASELINE[paint.baseline ?? "alphabetic"];
			fillAndStroke(environment, paint, (mode) =>
				mode === "fill"
					? context.fillText(node.text, 0, 0)
					: context.strokeText(node.text, 0, 0),
			);
			context.restore();
			return;
		}
	}
}

/** Paints the whole scene. The canvas is already scaled to device pixels. */
export function paintScene(
	context: CanvasRenderingContext2D,
	scene: ChartScene,
	resolve: (color: string) => string,
	fontFamily: string,
) {
	context.clearRect(0, 0, scene.width, scene.height);
	const environment = { context, resolve, fontFamily };
	for (const node of scene.nodes) {
		paintNode(environment, node);
	}
}
