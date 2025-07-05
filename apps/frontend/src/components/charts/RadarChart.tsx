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
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-6 text-center">
        Company Mentions Across Questions
      </h3>
      <div className="flex gap-8">
        <div className="flex-1 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadarChart cx="50%" cy="50%" outerRadius="60%" data={data}>
              <PolarGrid />
              <PolarAngleAxis
                dataKey="question"
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, "dataMax"]}
                tick={{ fontSize: 10 }}
                tickLine={false}
              />
              {companies.slice(0, 8).map((company, index) => (
                <Radar
                  key={company}
                  name={company}
                  dataKey={company}
                  stroke={COLORS[index % COLORS.length]}
                  fill={COLORS[index % COLORS.length]}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              ))}
              <Tooltip />
            </RechartsRadarChart>
          </ResponsiveContainer>
        </div>
        <div className="w-64 space-y-3">
          <h4 className="font-semibold text-sm mb-4">Companies</h4>
          {companies.map((company, index) => (
            <div key={company} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm font-medium truncate">{company}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
