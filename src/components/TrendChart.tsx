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
  data: TrendPoint[];
  label: string;
  rollingAvg?: boolean;
  accent?: boolean;
  height?: number;
}

function movingAverage(values: number[], window: number): Array<number | null> {
  return values.map((_, i) => {
    if (i < window - 1) return null;
    const slice = values.slice(i - window + 1, i + 1);
    return slice.reduce((a, b) => a + b, 0) / window;
  });
}

export function TrendChart({
  data,
  label,
  rollingAvg = true,
  accent = true,
  height = 160,
}: Props) {
  const avg = movingAverage(data.map((d) => d.value), 3);
  const rows = data.map((p, i) => ({
    date: p.date.slice(5),
    opponent: p.opponent,
    [label]: p.value,
    avg: avg[i],
  }));

  const primaryColor = accent ? '#d7622c' : '#974ca8';

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
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
          />
          <Line
            type="monotone"
            dataKey={label}
            stroke={primaryColor}
            strokeWidth={2.5}
            dot={{ r: 3, fill: primaryColor }}
            activeDot={{ r: 5 }}
          />
          {rollingAvg && (
            <Line
              type="monotone"
              dataKey="avg"
              stroke="rgba(27,26,23,0.3)"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
