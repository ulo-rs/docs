import type { ReactNode } from "react";

/**
 * The HTTP request pipeline, drawn as nesting rather than as a list.
 *
 * A linear diagram has to split interceptors into "before" and "after" steps,
 * which hides the thing worth knowing: middleware and interceptors *wrap* the
 * handler and see the response, while guards run on the way in only.
 * Nesting says that without a caption.
 */

type Layer =
  | { kind: "wrap"; id: string; label: string; note: string; children: Layer[] }
  | { kind: "step"; id: string; label: string; note: string };

const PIPELINE: Layer = {
  kind: "wrap",
  id: "global-middleware",
  label: "Global middleware",
  note: "before routing — sees 404s, 405s, and WebSocket upgrades",
  children: [
    {
      kind: "step",
      id: "route-resolution",
      label: "Route resolution",
      note: "a rewrite above changes what matches here",
    },
    {
      kind: "wrap",
      id: "module-middleware",
      label: "Module middleware",
      note: "matched route only",
      children: [
        {
          kind: "step",
          id: "guards",
          label: "Guards",
          note: "false → GuardRejection, rendered 403",
        },
        {
          kind: "wrap",
          id: "interceptors",
          label: "Interceptors",
          note: "next.run(ctx) — consumed once, both sides",
          children: [
            {
              kind: "step",
              id: "handler",
              label: "Route handler",
              note: "extractors resolve here",
            },
          ],
        },
      ],
    },
  ],
};

const W = 720;
const PAD = 16;
const INSET = 18;
const HEADER = 40;
const FOOT = 14;
const STEP_H = 52;
const GAP = 10;

function height(l: Layer): number {
  if (l.kind === "step") return STEP_H;
  return (
    HEADER +
    l.children.reduce((a, c) => a + height(c) + GAP, 0) -
    GAP +
    GAP +
    FOOT
  );
}

function render(l: Layer, depth: number, y: number): ReactNode[] {
  const x = PAD + depth * INSET;
  const w = W - 2 * x;
  const h = height(l);
  const out: ReactNode[] = [];

  if (l.kind === "step") {
    const accent = l.id === "handler";
    out.push(
      <g key={l.id}>
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx="7"
          fill={accent ? "var(--color-brand)" : "var(--color-fd-muted)"}
          fillOpacity={accent ? 0.14 : 1}
          stroke={accent ? "var(--color-brand)" : "var(--color-fd-border)"}
        />
        <text
          x={x + 14}
          y={y + 21}
          fontSize="13.5"
          fontWeight="600"
          fill="var(--color-fd-foreground)"
        >
          {l.label}
        </text>
        <text
          x={x + 14}
          y={y + 39}
          fontSize="11.5"
          fill="var(--color-fd-muted-foreground)"
        >
          {l.note}
        </text>
      </g>,
    );
    return out;
  }

  out.push(
    <g key={l.id}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="9"
        fill="var(--color-fd-card)"
        stroke="var(--color-fd-border)"
      />
      <text
        x={x + 14}
        y={y + 20}
        fontSize="13.5"
        fontWeight="600"
        fill="var(--color-fd-foreground)"
      >
        {l.label}
      </text>
      <text
        x={x + 14}
        y={y + 34}
        fontSize="11"
        fill="var(--color-fd-muted-foreground)"
      >
        {l.note}
      </text>
    </g>,
  );

  let cy = y + HEADER + GAP;
  for (const c of l.children) {
    out.push(...render(c, depth + 1, cy));
    cy += height(c) + GAP;
  }
  return out;
}

export function RequestPipeline() {
  const inner = height(PIPELINE);
  const TOP = 46;
  const BOTTOM = 32;
  const H = TOP + inner + BOTTOM;

  return (
    <figure className="not-prose my-6 overflow-x-auto rounded-xl border bg-fd-background p-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ minWidth: 560, fontFamily: "inherit" }}
        role="img"
        aria-label="The HTTP request pipeline. Global middleware wraps route resolution and everything after it. Module middleware wraps guards, interceptors, and the handler. Interceptors wrap the handler and see the response on the way out."
      >
        <defs>
          <marker
            id="pipe-arrow"
            viewBox="0 0 8 8"
            refX="6"
            refY="4"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 z" fill="var(--color-fd-muted-foreground)" />
          </marker>
        </defs>

        {/* A response leaves through the same outer boundary it entered, so
            both arrows belong at the top: in on the left, out on the right. */}
        <text
          x={PAD}
          y="18"
          fontSize="11.5"
          fontWeight="600"
          fill="var(--color-fd-muted-foreground)"
        >
          REQUEST
        </text>
        <line
          x1={PAD + 66}
          y1="13"
          x2={PAD + 66}
          y2={TOP - 10}
          stroke="var(--color-fd-muted-foreground)"
          strokeWidth="1.5"
          markerEnd="url(#pipe-arrow)"
        />

        <text
          x={W - PAD}
          y="18"
          textAnchor="end"
          fontSize="11.5"
          fontWeight="600"
          fill="var(--color-fd-muted-foreground)"
        >
          RESPONSE
        </text>
        <line
          x1={W - PAD - 74}
          y1={TOP - 10}
          x2={W - PAD - 74}
          y2="13"
          stroke="var(--color-fd-muted-foreground)"
          strokeWidth="1.5"
          markerEnd="url(#pipe-arrow)"
        />

        {render(PIPELINE, 0, TOP)}

        <text
          x={PAD}
          y={H - 10}
          fontSize="11.5"
          fill="var(--color-fd-muted-foreground)"
        >
          On error, handlers claim it method → controller → global.
        </text>
      </svg>
    </figure>
  );
}
