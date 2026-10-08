"use client";

import { useId } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import { formatMoney } from "@/lib/format-money";

export type SalesDataPoint = {
  day: number;
  current: number;
  previous: number;
  highlighted?: boolean;
};

type SalesChartProps = {
  data: SalesDataPoint[];
  monthLabel?: string;
  maxRevenue?: number;
};

function SalesTooltip({
  active,
  payload,
  label,
  monthLabel,
}: TooltipContentProps & { monthLabel: string }) {
  if (!active || !payload.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-[11px] text-ink shadow-sm">
      <p className="mb-2 font-semibold">
        {Math.round(Number(label))} {monthLabel}
      </p>
      <div className="grid gap-1">
        {payload.map((entry) => (
          <div key={String(entry.dataKey)} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={`size-2 rounded-full ${entry.dataKey === "current" ? "bg-primary-text" : "bg-previous-line-stroke-15"}`}
            />
            <span>{entry.name}</span>
            <strong className="ml-auto tabular-nums">
              {formatMoney(Number(entry.value))}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SalesChart({
  data,
  monthLabel = "Oct",
  maxRevenue = 800000,
}: SalesChartProps) {
  const gradientId = `sales-area-${useId()}`;
  const revenueTicks = Array.from(
    { length: 5 },
    (_, index) => (maxRevenue * index) / 4,
  );
  const dayTicks = [1, 6, 11, 16, 21, 26, 31];
  const highlighted = data.find((point) => point.highlighted);

  if (data.length === 0) {
    return (
      <div className="chart-wrap items-center justify-center text-xs text-muted">
        No sales data for this period.
      </div>
    );
  }

  return (
    <div
      className="chart-wrap"
      role="figure"
      aria-label="Daily sales revenue: this month compared with last month"
    >
      <div className="y-labels" aria-hidden="true">
        {revenueTicks.toReversed().map((value) => (
          <span key={value}>{value === 0 ? "₦0" : `₦${value / 1000}K`}</span>
        ))}
      </div>
      <div className="relative min-w-0 flex-1">
        <div className="h-[calc(100%-23px)] w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <ComposedChart
              data={data}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              accessibilityLayer
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    className="[stop-color:var(--color-primary-bright)]"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="100%"
                    className="[stop-color:var(--color-primary-bright)]"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" type="number" domain={[1, 31]} hide />
              <YAxis
                type="number"
                domain={[0, maxRevenue]}
                ticks={revenueTicks}
                hide
              />
              <CartesianGrid
                vertical={false}
                horizontalCoordinatesGenerator={({ offset }) =>
                  revenueTicks.map(
                    (_, index) => offset.top + (offset.height * index) / 4,
                  )
                }
                stroke="var(--color-grid-lines-i-border-14)"
                strokeDasharray="3 3"
              />
              <Tooltip
                content={(props) => (
                  <SalesTooltip {...props} monthLabel={monthLabel} />
                )}
                cursor={{
                  stroke: "var(--color-border)",
                  strokeDasharray: "3 3",
                }}
              />
              <Line
                type="monotone"
                dataKey="previous"
                name="Last month"
                stroke="var(--color-previous-line-stroke-15)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="current"
                name="This month"
                stroke="var(--color-primary-text)"
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "var(--color-surface)",
                  stroke: "var(--color-primary-text)",
                  strokeWidth: 2,
                }}
                isAnimationActive={false}
              />
              {highlighted && (
                <ReferenceDot
                  x={highlighted.day}
                  y={highlighted.current}
                  r={4}
                  fill="var(--color-surface)"
                  stroke="var(--color-primary-bright)"
                  strokeWidth={2}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="x-labels" aria-hidden="true">
          {dayTicks.map((day) => (
            <span key={day}>
              {day} {monthLabel}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
