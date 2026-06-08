import { AiBarChart } from './AiBarChart';
import { AiPieChart } from './AiPieChart';
import { AiLineChart } from './AiLineChart';
import { AiAreaChart } from './AiAreaChart';

export interface ChartConfig {
  type: 'bar' | 'pie' | 'line' | 'area';
  title?: string;
  data: any[];
  xAxisKey?: string;
  dataKey: string;
  nameKey?: string;
}

interface AiChartRendererProps {
  config: ChartConfig;
}

export function AiChartRenderer({ config }: AiChartRendererProps) {
  if (!config) {
    return <div className="text-danger p-2">Configuração de gráfico ausente.</div>;
  }

  const { type, data, xAxisKey, dataKey, nameKey, title } = config;

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div className="text-muted p-2">Dados do gráfico vazios ou inválidos.</div>;
  }

  if (!dataKey) {
    return <div className="text-danger p-2">Erro no gráfico: 'dataKey' é obrigatório.</div>;
  }

  // Set defaults
  const resolvedXAxisKey = xAxisKey || 'name';
  const resolvedNameKey = nameKey || resolvedXAxisKey;

  switch (type) {
    case 'bar':
      return (
        <AiBarChart
          data={data}
          xAxisKey={resolvedXAxisKey}
          dataKey={dataKey}
          title={title}
        />
      );
    case 'pie':
      return (
        <AiPieChart
          data={data}
          nameKey={resolvedNameKey}
          dataKey={dataKey}
          title={title}
        />
      );
    case 'line':
      return (
        <AiLineChart
          data={data}
          xAxisKey={resolvedXAxisKey}
          dataKey={dataKey}
          title={title}
        />
      );
    case 'area':
      return (
        <AiAreaChart
          data={data}
          xAxisKey={resolvedXAxisKey}
          dataKey={dataKey}
          title={title}
        />
      );
    default:
      return <div className="text-danger p-2">Tipo de gráfico desconhecido: {type}</div>;
  }
}
