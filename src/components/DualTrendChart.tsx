import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TrendPoint } from '@/types';

interface Props {
  primary: TrendPoint[];
  secondary: TrendPoint[];
  primaryLabel: string;
  secondaryLabel: string;
  height?: number;
}

export function DualTrendChart({
  primary,
  secondary,
  primaryLabel,
  secondaryLabel,
  height = 180,
}: Props) {
  const data = primary.map((p, i) => ({
    date: p.date.slice(5),
    opponent: p.opponent,
    [primaryLabel]: p.value,
    [secondaryLabel]: secondary[i]?.value ?? null,
  }));

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
          <CartesianGrid stroke="rgba(27,26,23,0.08)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: 'rgba(27,26,23,0.5)' }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(27,26,23,0.15)' }}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'rgba(27,26,23,0.5)' }}
            tickLine={false}
            axisLine={false}
            width={28}
          />
          <Tooltip
            cursor={{ stroke: 'rgba(27,26,23,0.15)' }}
            contentStyle={{
              background: '#fff',
              border: '1px solid rgba(27,26,23,0.12)',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelFormatter={(v, p) => {
              const op = p?.[0]?.payload?.opponent;
              return op ? `${v} · ${op}` : v;
            }}
          />
          <Line
            type="monotone"
            dataKey={primaryLabel}
            stroke="#d7622c"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#d7622c' }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey={secondaryLabel}
            stroke="#974ca8"
            strokeWidth={2}
            strokeDasharray="4 3"
            dot={{ r: 2.5, fill: '#974ca8' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
