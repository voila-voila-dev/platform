import type * as React from "react";
import { roundedBarPath } from "#/core/paths.ts";
import type {
	ChartPaint,
	ChartScene,
	ChartTextPaint,
	SceneNode,
} from "#/core/types.ts";

const BASELINE: Record<
	NonNullable<ChartTextPaint["baseline"]>,
	React.SVGAttributes<SVGTextElement>["dominantBaseline"]
> = {
	top: "hanging",
	middle: "central",
	bottom: "text-after-edge",
	alphabetic: "alphabetic",
};

function paintProps(paint: ChartPaint): React.SVGAttributes<SVGElement> {
	return {
		fill: paint.fill ?? "none",
		stroke: paint.stroke,
		strokeWidth: paint.strokeWidth,
		strokeDasharray: paint.strokeDasharray,
		strokeLinecap: paint.strokeLinecap,
		strokeLinejoin: paint.strokeLinejoin,
		opacity: paint.opacity,
		fillOpacity: paint.fillOpacity,
		strokeOpacity: paint.strokeOpacity,
	};
}

function SceneElement({
	node,
	clipPrefix,
}: {
	node: SceneNode;
	clipPrefix: string;
}) {
	const data = { "data-role": node.role, "data-series": node.series };
	switch (node.kind) {
		case "group": {
			const clipId = node.clip ? `${clipPrefix}-${node.key}` : undefined;
			return (
				<g
					{...data}
					transform={
						node.translate
							? `translate(${node.translate.x} ${node.translate.y})`
							: undefined
					}
					clipPath={clipId ? `url(#${clipId})` : undefined}
				>
					{node.clip && clipId ? (
						<clipPath id={clipId}>
							<rect {...node.clip} />
						</clipPath>
					) : null}
					{node.children.map((child) => (
						<SceneElement
							key={child.key}
							node={child}
							clipPrefix={clipPrefix}
						/>
					))}
				</g>
			);
		}
		case "rect":
			return node.corners ? (
				<path
					{...data}
					d={roundedBarPath({ ...node, radius: node.corners })}
					{...paintProps(node.paint)}
				/>
			) : (
				<rect
					{...data}
					x={node.x}
					y={node.y}
					width={node.width}
					height={node.height}
					{...paintProps(node.paint)}
				/>
			);
		case "path":
			return <path {...data} d={node.d} {...paintProps(node.paint)} />;
		case "circle":
			return (
				<circle
					{...data}
					cx={node.cx}
					cy={node.cy}
					r={node.r}
					{...paintProps(node.paint)}
				/>
			);
		case "line":
			return (
				<line
					{...data}
					x1={node.x1}
					y1={node.y1}
					x2={node.x2}
					y2={node.y2}
					{...paintProps(node.paint)}
				/>
			);
		case "text":
			return (
				<text
					{...data}
					x={node.x}
					y={node.y}
					transform={
						node.rotate
							? `rotate(${node.rotate} ${node.x} ${node.y})`
							: undefined
					}
					fontSize={node.paint.fontSize}
					fontWeight={node.paint.fontWeight}
					textAnchor={node.paint.textAnchor}
					dominantBaseline={
						node.paint.baseline ? BASELINE[node.paint.baseline] : undefined
					}
					{...paintProps(node.paint)}
				>
					{node.text}
				</text>
			);
	}
}

/** The scene's nodes as SVG elements, keyed so React reconciles a data update in place. */
export function SvgSceneNodes({
	scene,
	clipPrefix,
}: {
	scene: ChartScene;
	clipPrefix: string;
}) {
	return scene.nodes.map((node) => (
		<SceneElement key={node.key} node={node} clipPrefix={clipPrefix} />
	));
}
