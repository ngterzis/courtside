import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
} from 'recharts';

interface RadarDatum {
  axis: string;
  value: number; // 0–100 (percentile)
}

interface Props {
  data: RadarDatum[];
  size?: number;
}

export function RadarChart({ data, size = 220 }: Props) {
  return (
    <div style={{ width: '100%', height: size }}>
      <ResponsiveContainer>
        <RechartsRadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke="rgba(27,26,23,0.12)" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fontSize: 11, fontWeight: 600, fill: 'rgba(27,26,23,0.65)' }}
          />
          <Radar
            dataKey="value"
            stroke="#974ca8"
            strokeWidth={2}
            fill="#974ca8"
            fillOpacity={0.18}
            dot={{ r: 3, fill: '#974ca8', strokeWidth: 0 }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
