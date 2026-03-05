import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Funcionarios } from '../../pages/Funcionarios/Funcionarios';

export interface GraficsProps {
    funcionarios?: Funcionarios[];
} 

export function GraficoCargoPizza({ funcionarios } : GraficsProps) {
    
    const COLORS_SETOR = [
        '#0088FE', // Azul (TI)
        '#00C49F', // Verde (RH)
        '#FFBB28', // Amarelo (Financeiro)
        '#FF8042', // Laranja (Marketing)
        '#8884d8', // Roxo (Vendas)
        '#82ca9d'  // Menta (Operacional)
    ];

    const dadosCargos = () => {
        const cargosUnicos = [...new Set(funcionarios?.map(f => f.cargo))];
        return cargosUnicos.map((cargo, index) => ({
            name: cargo,
            value: funcionarios?.filter(f => f.cargo === cargo).length,
            fill: COLORS_SETOR[index],
        })).sort((a, b) => (b?.value ?? 0) - (a?.value ?? 0)); 
    };

    return (
        <div style={{height: '350px', width: '100%'}}>
            <h5>Quantidade de funcionários por cargo</h5>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={dadosCargos()}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name}: ${value}`}
                    />
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}