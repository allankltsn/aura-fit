import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';

export type LineChartProps = {
  data: number[];
  labels: string[];
  max: number;
  ticks: number[];
  formatValue?: (v: number) => string;
  width?: number;
  height?: number;
  color?: string;
};

/** Line chart with dashed gridlines + emphasized endpoint — matches the kit's chart() helper. */
export function LineChart({
  data,
  labels,
  max,
  ticks,
  formatValue = String,
  width = 320,
  height = 200,
  color = '#b1111b',
}: LineChartProps) {
  const left = 36;
  const right = 10;
  const top = 14;
  const bottom = 24;
  const n = data.length;

  const x = (i: number) => left + (i * (width - left - right)) / (n - 1);
  const y = (v: number) => top + (1 - v / max) * (height - top - bottom);

  const points = data.map((v, i) => `${x(i)},${y(v)}`).join(' ');

  return (
    <Svg width={width} height={height}>
      {ticks.map((t) => (
        <Line
          key={t}
          x1={left}
          x2={width - right}
          y1={y(t)}
          y2={y(t)}
          stroke="#e3e3e3"
          strokeWidth={1}
          strokeDasharray="3 4"
        />
      ))}
      {ticks.map((t) => (
        <SvgText key={`tl-${t}`} x={left - 8} y={y(t) + 4} fontSize={10} fill="#666666" textAnchor="end">
          {formatValue(t)}
        </SvgText>
      ))}
      {labels.map((l, i) => (
        <SvgText key={l} x={x(i)} y={height - 6} fontSize={10} fill="#666666" textAnchor="middle">
          {l}
        </SvgText>
      ))}
      <Polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) =>
        i < n - 1 ? <Circle key={i} cx={x(i)} cy={y(v)} r={3.5} fill="#ffffff" stroke={color} strokeWidth={2} /> : null
      )}
      <Circle cx={x(n - 1)} cy={y(data[n - 1])} r={6} fill={color} stroke="#ffffff" strokeWidth={3} />
      <SvgText x={x(n - 1) - 10} y={y(data[n - 1]) - 12} fontSize={12} fontWeight="600" fill={color} textAnchor="end">
        {formatValue(data[n - 1])}
      </SvgText>
    </Svg>
  );
}
