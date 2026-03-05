import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { GraficsProps } from "../Pizza/Pizza";

export function GraficoBarraEscolaridade({ funcionarios } : GraficsProps) {
    const escolaridadeUnica = [...new Set(funcionarios?.map(f => f.escolaridade))];

    const data = escolaridadeUnica.map(escolaridade => {
        const funcionariosDoSetor = funcionarios?.filter(f => f.escolaridade === escolaridade);

        return {
            escolaridade: escolaridade,
            quantidade: Number(funcionariosDoSetor?.length)
        };
    });

    const CORES_ESCOLARIDADE: { [key: string]: string } = {
        "Ensino Fundamental Incompleto": "#FF8042",
        "Ensino Fundamental Completo": "#FFBB28",
        "Ensino Médio Incompleto": "#CCEBC5",
        "Ensino Médio Completo": "#4eb33d",
        "Ensino Superior Incompleto": "#82ca9d",
        "Ensino Superior Completo": "#00C49F",
        "Pós-graduação / Especialização": "#0088FE",
        "Mestrado": "#8884d8",
        "Doutorado": "#5c58b0"
    };

    return (
        <div className="card shadow-sm border-0">
            <div className="card-body">
            <h5 className="card-title fw-bold">Quantidade de funcionários por grau de escolaridade</h5>
                <div style={{ width: '1200px', height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis 
                                dataKey="escolaridade" 
                                angle={-15} 
                                textAnchor="end" 
                                interval={0} 
                                fontSize={12}
                            />
                            <YAxis tickFormatter={(value) => `${value}`} />
                            <Tooltip 
                                formatter={(value: number | undefined) => [`${value} funcionários`, 'Quantidade']}
                            />
                            <Bar dataKey="quantidade" radius={[4, 4, 0, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CORES_ESCOLARIDADE[entry.escolaridade]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}