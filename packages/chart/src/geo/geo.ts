import { mixPath } from "@voila.dev/motion";
import {
	type GeoPermissibleObjects,
	type GeoProjection,
	geoAlbersUsa,
	geoArea,
	geoConicConformal,
	geoEqualEarth,
	geoEquirectangular,
	geoMercator,
	geoNaturalEarth1,
	geoOrthographic,
	geoPath,
} from "d3-geo";
import { isPlaceable, numericValue, readChannel } from "#/core/channel.ts";
import { markId, paint } from "#/core/marks/shared.ts";
import type {
	ChartAccessor,
	ChartFittedProjection,
	ChartMark,
	ChartPoint,
	ChartProjection,
	ChartValue,
	SceneNode,
} from "#/core/types.ts";

export type ProjectionName =
	| "equal-earth"
	| "natural-earth"
	| "mercator"
	| "equirectangular"
	| "orthographic"
	| "albers-usa"
	/** Conformal conic on France's own standard parallels (Lambert 93's). */
	| "france";

const PROJECTIONS: Record<ProjectionName, () => GeoProjection> = {
	"equal-earth": geoEqualEarth,
	"natural-earth": geoNaturalEarth1,
	mercator: geoMercator,
	equirectangular: geoEquirectangular,
	orthographic: geoOrthographic,
	"albers-usa": geoAlbersUsa as unknown as () => GeoProjection,
	france: () => geoConicConformal().parallels([44, 49]).rotate([-3, 0]),
};

type Ring = ReadonlyArray<ReadonlyArray<number>>;

function reverseRings(geometry: {
	type: string;
	coordinates?: unknown;
}): unknown {
	if (geometry.type === "Polygon") {
		return {
			...geometry,
			coordinates: (geometry.coordinates as Ring[]).map((ring) =>
				[...ring].reverse(),
			),
		};
	}
	if (geometry.type === "MultiPolygon") {
		return {
			...geometry,
			coordinates: (geometry.coordinates as Ring[][]).map((polygon) =>
				polygon.map((ring) => [...ring].reverse()),
			),
		};
	}
	return geometry;
}

/**
 * GeoJSON as RFC 7946 writes it winds rings counter-clockwise; d3-geo reads
 * that as "the whole sphere except this region". A shape covering more than
 * half the globe is that mistake, so its rings are turned round.
 */
export function rewind<T>(object: T): T {
	const value = object as {
		type?: string;
		features?: unknown[];
		geometry?: { type: string };
	};
	if (value.type === "FeatureCollection" && Array.isArray(value.features)) {
		return {
			...value,
			features: value.features.map((feature) => rewind(feature)),
		} as T;
	}
	if (value.type === "Feature" && value.geometry) {
		return geoArea(value as GeoPermissibleObjects) > 2 * Math.PI
			? ({ ...value, geometry: reverseRings(value.geometry) } as T)
			: object;
	}
	return object;
}

export interface ProjectionOptions {
	/** The GeoJSON the map should frame: usually the shapes it draws. */
	readonly domain: GeoPermissibleObjects;
	/** Pixels kept clear around the framed shape. */
	readonly inset?: number;
}

/**
 * How longitude and latitude become pixels, fitted so `domain` fills the
 * plot. A name picks one of the usual projections; any d3-geo projection
 * factory works too.
 */
export function projection(
	kind: ProjectionName | (() => GeoProjection),
	options: ProjectionOptions,
): ChartProjection {
	return {
		fit(plot): ChartFittedProjection {
			const inset = options.inset ?? 4;
			const projected = (
				typeof kind === "function" ? kind : PROJECTIONS[kind]
			)().fitExtent(
				[
					[plot.x + inset, plot.y + inset],
					[plot.x + plot.width - inset, plot.y + plot.height - inset],
				],
				rewind(options.domain),
			);
			const path = geoPath(projected);
			return {
				project(longitude, latitude) {
					const point = projected([longitude, latitude]);
					return point ? { x: point[0], y: point[1] } : undefined;
				},
				path: (geometry) => path(geometry as GeoPermissibleObjects) ?? "",
				centroid(geometry) {
					const [x, y] = path.centroid(geometry as GeoPermissibleObjects);
					return { x, y };
				},
				bounds(geometry) {
					const [[x0, y0], [x1, y1]] = path.bounds(
						geometry as GeoPermissibleObjects,
					);
					return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
				},
			};
		},
	};
}

interface Feature {
	readonly type: "Feature";
	readonly properties?: Record<string, unknown> | null;
	readonly geometry: unknown;
}

export interface GeoShapeOptions<TFeature> {
	readonly id?: string;
	/** A region's name: tooltip, table, live region. */
	readonly name: ChartAccessor<TFeature, unknown>;
	/** A value per region: a choropleth on a sequential (numbers) or ordinal (categories) color scale. */
	readonly color?: ChartAccessor<TFeature, ChartValue>;
	readonly fill?: string;
	readonly stroke?: string;
	/** What the colour values are, for the table heading. */
	readonly label?: string;
	readonly tip?: boolean;
}

/** Regions, countries, départements: one shape per GeoJSON feature. */
export function geoShape<TFeature extends Feature>(
	features: ReadonlyArray<TFeature>,
	options: GeoShapeOptions<TFeature>,
): ChartMark {
	const names = readChannel(features, options.name);
	const colors = readChannel(features, options.color);
	return {
		id: options.id,
		coordinate: "frame",
		focusOrder: "point",
		titles: { value: options.label },
		channels:
			options.color === undefined
				? {}
				: { color: { values: colors.filter(isPlaceable) } },
		render(context) {
			const id = markId(options.id, "geo", context);
			const fitted = context.projection;
			if (fitted === undefined) {
				return { nodes: [] };
			}
			const nodes: SceneNode[] = [];
			const points: ChartPoint[] = [];
			for (const [index, feature] of features.entries()) {
				const name = String(names[index] ?? index);
				const value = colors[index];
				const fill =
					options.fill ??
					(value === undefined || options.color === undefined
						? context.theme.grid
						: context.colorOf(value));
				const shape = rewind(feature);
				const d = fitted.path(shape);
				if (d === "") continue;
				nodes.push({
					kind: "path",
					key: `${id}:${name}`,
					role: "mark",
					d,
					morph: mixPath,
					paint: paint({
						fill,
						stroke: options.stroke ?? context.theme.background,
						strokeWidth: 0.75,
					}),
				});
				if (options.tip !== false) {
					const center = fitted.centroid(shape);
					const number = numericValue(value);
					points.push({
						key: `${id}:${name}`,
						markId: id,
						index,
						datum: feature,
						x: center.x,
						y: center.y,
						xValue: name,
						yValue: value,
						seriesLabel: options.label,
						color: fill,
						title: name,
						value:
							value === undefined
								? ""
								: number === undefined
									? String(value)
									: context.formatY(number),
						hit: { kind: "rect", rect: fitted.bounds(shape) },
					});
				}
			}
			return { nodes, points };
		},
	};
}

export interface GeoDotOptions<TDatum> {
	readonly id?: string;
	readonly longitude: ChartAccessor<TDatum, ChartValue>;
	readonly latitude: ChartAccessor<TDatum, ChartValue>;
	readonly name: ChartAccessor<TDatum, unknown>;
	/** A radius in pixels, or a field whose values set each dot's area. */
	readonly r?: number | ChartAccessor<TDatum, ChartValue>;
	readonly maxRadius?: number;
	readonly fill?: string;
	readonly label?: string;
	readonly value?: ChartAccessor<TDatum, ChartValue>;
	readonly tip?: boolean;
}

/** Places on the map: a dot at each longitude and latitude, sized by a value if asked. */
export function geoDot<TDatum>(
	data: ReadonlyArray<TDatum>,
	options: GeoDotOptions<TDatum>,
): ChartMark {
	const longitudes = readChannel(data, options.longitude).map(numericValue);
	const latitudes = readChannel(data, options.latitude).map(numericValue);
	const names = readChannel(data, options.name);
	const values = readChannel(data, options.value).map(numericValue);
	const sized = options.r !== undefined && typeof options.r !== "number";
	const sizes = sized
		? readChannel(data, options.r as ChartAccessor<TDatum, ChartValue>).map(
				numericValue,
			)
		: [];
	const largest = Math.max(0, ...sizes.map((size) => Math.abs(size ?? 0)));
	return {
		id: options.id,
		coordinate: "frame",
		focusOrder: "point",
		titles: { value: options.label },
		channels: {},
		render(context) {
			const id = markId(options.id, "geoDot", context);
			const fitted = context.projection;
			if (fitted === undefined) {
				return { nodes: [] };
			}
			const color = options.fill ?? context.paletteColor(context.markIndex);
			const maxRadius = options.maxRadius ?? 16;
			const nodes: SceneNode[] = [];
			const points: ChartPoint[] = [];
			for (const [index, datum] of data.entries()) {
				const longitude = longitudes[index];
				const latitude = latitudes[index];
				if (longitude === undefined || latitude === undefined) continue;
				const at = fitted.project(longitude, latitude);
				if (at === undefined) continue;
				const r =
					typeof options.r === "number"
						? options.r
						: sized
							? largest === 0
								? 0
								: Math.sqrt(Math.abs(sizes[index] ?? 0) / largest) * maxRadius
							: 4;
				const name = String(names[index] ?? index);
				nodes.push({
					kind: "circle",
					key: `${id}:${index}`,
					role: "mark",
					cx: at.x,
					cy: at.y,
					r,
					paint: {
						fill: color,
						fillOpacity: 0.75,
						stroke: context.theme.background,
						strokeWidth: 1,
					},
				});
				if (options.tip !== false) {
					const value = values[index] ?? sizes[index];
					points.push({
						key: `${id}:${index}`,
						markId: id,
						index,
						datum,
						x: at.x,
						y: at.y,
						xValue: name,
						yValue: value,
						seriesLabel: options.label,
						color,
						title: name,
						value: value === undefined ? "" : context.formatY(value),
						hit: {
							kind: "rect",
							rect: {
								x: at.x - r - 2,
								y: at.y - r - 2,
								width: r * 2 + 4,
								height: r * 2 + 4,
							},
						},
					});
				}
			}
			return { nodes, points };
		},
	};
}
