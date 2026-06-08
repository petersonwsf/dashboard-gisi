import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export interface AiLineChartProps {
  data: any[];
  xAxisKey: string;
  dataKey: string;
  title?: string;
  colors?: string[];
}

const DEFAULT_COLORS = ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#0dcaf0'];

export function AiLineChart({ data, xAxisKey, dataKey, title, colors = DEFAULT_COLORS }: AiLineChartProps) {
  if (!data || data.length === 0) {
    return <div className="text-muted text-center p-3">Nenhum dado disponível para o gráfico de linha.</div>;
  }

  return (
    <div className="card shadow-sm border-0 bg-white rounded-3 p-3 my-3 w-100" style={{ minWidth: '280px' }}>
      {title && <h6 className="fw-semibold text-secondary mb-3">{title}</h6>}
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 15, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6c757d', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6c757d', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{ background: '#fff', border: '1px solid #dee2e6', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              formatter={(value: any) => [typeof value === 'number' ? value.toLocaleString('pt-BR') : value, 'Valor']}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={colors[0]}
              strokeWidth={3}
              activeDot={{ r: 8 }}
              name={title || dataKey}
              dot={{ strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
