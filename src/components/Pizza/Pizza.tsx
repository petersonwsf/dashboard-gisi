import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Funcionarios } from '../../pages/Funcionarios/Funcionarios';

export interface GraficsProps {
    funcionarios?: Funcionarios[];
} 

export function Pizza({ funcionarios } : GraficsProps) {
    const data = [
        { name: 'Masculino', value: funcionarios?.filter(f => f.sexo === 'Masculino').length , fill: '#0088FE'},
        { name: 'Feminino', value: funcionarios?.filter(f => f.sexo === 'Feminino').length, fill: '#FF54A7' },
    ];

    return (
        <div style={{height: '300px', width: '500px'}}>
            <h5>Quantidade de funcionários por sexo</h5>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                    data={data}
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