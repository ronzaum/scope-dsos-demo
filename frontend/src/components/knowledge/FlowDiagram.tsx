import { useRef, useEffect, useState, useCallback } from "react";

interface FlowStep {
  id: string;
  label: string;
  detail?: string;
}

interface FlowDiagramProps {
  steps: FlowStep[];
  selectedStepId?: string;
  onStepClick: (id: string) => void;
}

// Layout constants
const NODE_W = 160;
const NODE_H = 44;
const GAP_X = 36;
const GAP_Y = 28;
const PADDING = 16;
const ARROW_SIZE = 6;
const FONT_SIZE = 11;
const RADIUS = 8;

/**
 * Data-driven SVG flow diagram. Renders steps as rounded-rect nodes
 * connected by arrow lines. Wraps to next row when container width
 * is exceeded. Selected step gets a highlighted border.
 */
export function FlowDiagram({ steps, selectedStepId, onStepClick }: FlowDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);

  // Track container width for responsive wrapping
  const measure = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, []);

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [measure]);

  // Calculate how many nodes fit per row
  const nodesPerRow = Math.max(1, Math.floor((containerWidth - PADDING * 2 + GAP_X) / (NODE_W + GAP_X)));

  // Position each node
  const positions = steps.map((_, i) => {
    const row = Math.floor(i / nodesPerRow);
    const col = i % nodesPerRow;
    const x = PADDING + col * (NODE_W + GAP_X);
    const y = PADDING + row * (NODE_H + GAP_Y);
    return { x, y };
  });

  const totalRows = Math.ceil(steps.length / nodesPerRow);
  const svgWidth = Math.min(containerWidth, PADDING * 2 + nodesPerRow * NODE_W + (nodesPerRow - 1) * GAP_X);
  const svgHeight = PADDING * 2 + totalRows * NODE_H + (totalRows - 1) * GAP_Y;

  return (
    <div ref={containerRef} className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        width={svgWidth}
        height={svgHeight}
        className="select-none"
      >
        {/* Arrow marker definition */}
        <defs>
          <marker
            id="flow-arrow"
            markerWidth={ARROW_SIZE}
            markerHeight={ARROW_SIZE}
            refX={ARROW_SIZE}
            refY={ARROW_SIZE / 2}
            orient="auto"
          >
            <path
              d={`M 0 0 L ${ARROW_SIZE} ${ARROW_SIZE / 2} L 0 ${ARROW_SIZE} Z`}
              className="fill-muted-foreground/40"
            />
          </marker>
          <marker
            id="flow-arrow-selected"
            markerWidth={ARROW_SIZE}
            markerHeight={ARROW_SIZE}
            refX={ARROW_SIZE}
            refY={ARROW_SIZE / 2}
            orient="auto"
          >
            <path
              d={`M 0 0 L ${ARROW_SIZE} ${ARROW_SIZE / 2} L 0 ${ARROW_SIZE} Z`}
              className="fill-primary/60"
            />
          </marker>
        </defs>

        {/* Connector lines between sequential steps */}
        {steps.map((step, i) => {
          if (i === 0) return null;
          const from = positions[i - 1];
          const to = positions[i];
          const prevRow = Math.floor((i - 1) / nodesPerRow);
          const currRow = Math.floor(i / nodesPerRow);

          // Determine if the arrow leads to/from the selected step
          const isAdjacentToSelected =
            steps[i].id === selectedStepId || steps[i - 1].id === selectedStepId;
          const markerUrl = isAdjacentToSelected ? "url(#flow-arrow-selected)" : "url(#flow-arrow)";
          const strokeClass = isAdjacentToSelected
            ? "stroke-primary/50"
            : "stroke-muted-foreground/25";

          if (prevRow === currRow) {
            // Same row — horizontal arrow
            const x1 = from.x + NODE_W;
            const y1 = from.y + NODE_H / 2;
            const x2 = to.x - ARROW_SIZE;
            const y2 = to.y + NODE_H / 2;
            return (
              <line
                key={`line-${i}`}
                x1={x1} y1={y1} x2={x2} y2={y2}
                className={strokeClass}
                strokeWidth={1.5}
                markerEnd={markerUrl}
              />
            );
          } else {
            // Row wrap — draw an L-shaped connector: down from end of prev row, then right to start of next row
            const x1 = from.x + NODE_W / 2;
            const y1 = from.y + NODE_H;
            const x2 = to.x + NODE_W / 2;
            const y2 = to.y - ARROW_SIZE;
            const midY = from.y + NODE_H + GAP_Y / 2;
            return (
              <polyline
                key={`line-${i}`}
                points={`${x1},${y1} ${x1},${midY} ${x2},${midY} ${x2},${y2}`}
                fill="none"
                className={strokeClass}
                strokeWidth={1.5}
                markerEnd={markerUrl}
              />
            );
          }
        })}

        {/* Step nodes */}
        {steps.map((step, i) => {
          const { x, y } = positions[i];
          const isSelected = step.id === selectedStepId;
          return (
            <g
              key={step.id}
              className="cursor-pointer"
              onClick={() => onStepClick(step.id)}
            >
              {/* Node background */}
              <rect
                x={x} y={y}
                width={NODE_W} height={NODE_H}
                rx={RADIUS} ry={RADIUS}
                className={
                  isSelected
                    ? "fill-primary/15 stroke-primary stroke-[1.5]"
                    : "fill-card stroke-border stroke-1 hover:stroke-primary/40"
                }
              />
              {/* Step number badge */}
              <circle
                cx={x + 16} cy={y + NODE_H / 2}
                r={10}
                className={isSelected ? "fill-primary/25" : "fill-secondary"}
              />
              <text
                x={x + 16} y={y + NODE_H / 2}
                textAnchor="middle" dominantBaseline="central"
                className={`text-[9px] font-mono font-semibold ${
                  isSelected ? "fill-primary" : "fill-muted-foreground"
                }`}
              >
                {i + 1}
              </text>
              {/* Label text — truncate long labels */}
              <text
                x={x + 34} y={y + NODE_H / 2}
                dominantBaseline="central"
                className={`text-[${FONT_SIZE}px] ${
                  isSelected ? "fill-foreground font-medium" : "fill-muted-foreground"
                }`}
                style={{ fontSize: FONT_SIZE }}
              >
                {step.label.length > 16 ? step.label.slice(0, 15) + "..." : step.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
