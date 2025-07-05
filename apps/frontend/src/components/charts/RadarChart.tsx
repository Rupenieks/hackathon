import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface RadarChartProps {
  data: Array<{
    question: string;
    [key: string]: string | number;
  }>;
  companies: string[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

export function RadarChart({ data, companies }: RadarChartProps) {
  return (
    <div className="w-full h-96">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Company Mentions Across Questions
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="question" />
          <PolarRadiusAxis angle={30} domain={[0, "dataMax"]} />
          {companies.map((company, index) => (
            <Radar
              key={company}
              name={company}
              dataKey={company}
              stroke={COLORS[index % COLORS.length]}
              fill={COLORS[index % COLORS.length]}
              fillOpacity={0.3}
            />
          ))}
          <Tooltip />
          <Legend />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
