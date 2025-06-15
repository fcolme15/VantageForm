import { ProjectionType } from "@/components/dashboard/Interfaces"
import { TrendingUp } from 'lucide-react';

interface ProjectionChartProps {
    data: number[];
    type: ProjectionType;
}
  
const ProjectionChart: React.FC<ProjectionChartProps> = ({ data, type }) => {
  const chartData = [65, 78, 82, 75, 90, 85, 92];
  const maxValue = Math.max(...chartData);
  
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-white">7-Day Trend</h4>
        <div className="flex items-center gap-2 text-green-400">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm">+12% trend</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 items-end h-32">
        {chartData.map((value, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t transition-all hover:from-green-500 hover:to-green-300"
              style={{
                height: `${(value / maxValue) * 100}%`,
                minHeight: '8px'
              }}
            />
            <span className="text-xs text-gray-400 mt-1">
              {new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).getDate()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};


export default ProjectionChart;