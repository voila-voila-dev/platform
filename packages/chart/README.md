# @voila.dev/chart

Charts as data. A chart is a definition — a list of marks over data — and
`<Chart>` draws it to SVG (default) or Canvas, with keyboard focus on every
value, a live region that reads the focused value, a legend that toggles
series, and the values as a hidden table.

```tsx
import { barY, defineChart, lineY, ruleY } from "@voila.dev/chart";
import { Chart } from "@voila.dev/chart/react";

const definition = useMemo(
	() =>
		defineChart({
			marks: [
				barY(months, { x: "month", y: "missions", label: "Missions" }),
				ruleY([40], { label: "Objectif", strokeDasharray: "4 4" }),
			],
		}),
	[months],
);

<Chart definition={definition} ariaLabel="Missions par mois" height={240} />;
```

For thousands of marks, paint on a canvas; nothing else changes:

```tsx
import { CanvasRenderer } from "@voila.dev/chart/canvas";

<Chart definition={definition} ariaLabel="…" renderer={CanvasRenderer} />;
```

## Pipeline

`compileChart(definition, { width, height })` is pure: marks declare
channels, the channels resolve the scales (linear, log, time, band, point,
ordinal and sequential colour), the axes are measured and laid out, and each
mark returns scene nodes and focusable points. Both renderers draw that scene;
hit-testing, keyboard focus, the tooltip and the data table read it.

## Marks

Cartesian: `lineY` `lineX` `areaY` `areaX` `barY` `barX` `dot` `cell` `ruleY` `ruleX` `text`

Round and frame: `arc` `donut` `radialBar` `radar` `funnel`

Statistical (no d3): `histogram` `rectY` `boxY` `violinY` `ridgeline`
`dodgeY` `waffleY` `differenceY` `regressionY` `hexbin`

Behind their own subpath, with the d3 module they need:
`@voila.dev/chart/contour` (`density2d`, d3-contour),
`@voila.dev/chart/voronoi` (`voronoi`, d3-delaunay).

## Keyboard

Tab reaches the chart. The arrows move along the values (a column of a
multi-series chart is one stop, the other arrows move inside it), Home and
End jump to the ends, Enter pins the tooltip and fires `onSelect`, Escape
unpins then leaves.

## Size budget

`bun run check-bundle` builds each entry in `scripts/bundle-entries` and fails
past its gzip budget, or when the core or the React layer retains a `d3-*`
module.
