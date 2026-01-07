import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card } from '../ui/Card'

interface IntegrationChartProps {
  data: { name: string; configured: number; total: number }[]
}

const COLORS = ['#0ea5e9', '#22c55e', '#f97316', '#8b5cf6', '#ec4899', '#eab308', '#06b6d4', '#f43f5e']

export function IntegrationChart({ data }: IntegrationChartProps) {
  const chartData = data.map((item, index) => ({
    name: item.name,
    value: item.configured,
    total: item.total,
    color: COLORS[index % COLORS.length],
  }))

  return (
    <Card variant="glass">
      <h3 className="text-lg font-semibold text-white mb-4">Intégrations par Catégorie</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
              {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px' }} />
            <Legend formatter={(value) => <span className="text-gray-300">{value}</span>} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
