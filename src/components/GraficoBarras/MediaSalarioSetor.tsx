import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { GraficsProps } from "../Pizza/Pizza";

export function MediaSalarioSetor({ funcionarios } : GraficsProps) {
    const setoresUnicos = [...new Set(funcionarios?.map(f => f.setor))];

    const data = setoresUnicos.map(setor => {
        const funcionariosDoSetor = funcionarios?.filter(f => f.setor === setor);
        const somaSalarios = funcionariosDoSetor?.reduce((acc, curr) => acc + curr.salario, 0);
        const media = somaSalarios! / funcionariosDoSetor!.length;

        return {
            setor: setor,
            media: Number(media.toFixed(2)) // Formata para 2 casas decimais
        };
    });

    const COLORS = ['#0088FE', '#00C49F', '#2fb81c', '#9628c2', '#8884d8'];

    return (
        <div className="card shadow-sm border-0">
            <div className="card-body">
            <h5 className="card-title fw-bold">Média Salarial por Setor</h5>
                <div style={{ width: '500px', height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis 
                                dataKey="setor" 
                                angle={-15} 
                                textAnchor="end" 
                                interval={0} 
                                fontSize={12}
                            />
                            <YAxis tickFormatter={(value) => `R$ ${value}`} />
                            <Tooltip 
                                formatter={(value: number | undefined) => {
                                    if (typeof value === 'undefined') return 'R$ 0,00';
                                    
                                    return new Intl.NumberFormat('pt-BR', { 
                                        style: 'currency', 
                                        currency: 'BRL' 
                                    }).format(value);
                                }}
                            />
                            <Bar dataKey="media" radius={[4, 4, 0, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}