import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';
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
        <div style={{height: '350px', width: '450px', borderRadius: '20px'}} className='bg-light p-4 shadow'>
            <h5>Quantidade de funcionários por sexo</h5>
            <ResponsiveContainer width="100%" height="100%">
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
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}