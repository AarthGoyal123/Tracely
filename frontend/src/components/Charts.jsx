import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

// Custom label component to truncate long names
const CustomXAxisLabel = ({ value }) => {
  const truncated = value.length > 20 ? value.substring(0, 20) + '...' : value
  return <text x={0} y={0} textAnchor="end" angle={-45}>{truncated}</text>
}

export default function TrackerChart({ data = [] }) {
  // Use top 10 trackers if data is provided
  const chartData = data && data.length > 0 ? data : [
    { name: 'No data', count: 0 }
  ]

  return (
    <div className="glass p-6 rounded-xl border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Tracker Distribution</h3>
      {chartData.length > 0 && chartData[0].count > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={120}
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              formatter={(value) => value.toLocaleString()}
              labelStyle={{ color: '#333' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="count" fill="#7c63ff" radius={[8, 8, 0, 0]} name="Sightings" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-96 text-gray-500">
          <p>No tracker data available. Use the extension to start collecting data.</p>
        </div>
      )}
    </div>
  )
}

export function TrendChart({ data = [] }) {
  return (
    <div className="glass p-6 rounded-xl border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#7c4cff"
            strokeWidth={2}
            dot={{ fill: '#7c4cff', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
