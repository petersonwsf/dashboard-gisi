import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

export interface AiPieChartProps {
  data: any[];
  nameKey: string;
  dataKey: string;
  title?: string;
  colors?: string[];
}

const DEFAULT_COLORS = ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#0dcaf0', '#6610f2', '#fd7e14', '#20c997', '#6f42c1'];

export function AiPieChart({ data, nameKey, dataKey, title, colors = DEFAULT_COLORS }: AiPieChartProps) {
  if (!data || data.length === 0) {
    return <div className="text-muted text-center p-3">Nenhum dado disponível para o gráfico de pizza.</div>;
  }

  // Calculate percentages for tooltip/labels if helpful
  const total = data.reduce((sum, item) => sum + Number(item[dataKey] || 0), 0);

  const dataWithPercentage = data.map(item => ({
    ...item,
    percentage: total > 0 ? ((Number(item[dataKey]) / total) * 100).toFixed(1) + '%' : '0%'
  }));

  return (
    <div className="card shadow-sm border-0 bg-white rounded-3 p-3 my-3 w-100" style={{ minWidth: '280px' }}>
      {title && <h6 className="fw-semibold text-secondary mb-3">{title}</h6>}
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataWithPercentage}
              nameKey={nameKey}
              dataKey={dataKey}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              label={({ name, value, percent }) => `${name}: ${value} (${((percent ?? 0) * 100).toFixed(0)}%)`}
            >
              {dataWithPercentage.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#fff', border: '1px solid #dee2e6', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              formatter={(value: any, name: any, props: any) => [
                `${value} (${props.payload.percentage})`,
                name
              ]}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
