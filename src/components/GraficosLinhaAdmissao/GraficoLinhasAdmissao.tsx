import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { GraficsProps } from "../Pizza/Pizza";
import { useState } from 'react';

export function GraficoLinhasAdmissao({funcionarios} : GraficsProps) {
    
    const dadosContratacao = () => {
    
    const anos = funcionarios?.map(f => {
        const data = f.dataAdmissao ? new Date(f.dataAdmissao) : new Date();
        return data.getFullYear();
    });

   
    const contagemPorAno = anos?.reduce((acc: {[key: number]: number}, ano) => {
        acc[ano] = (acc[ano] || 0) + 1;
        return acc;
    }, {});

    return contagemPorAno ? Object.keys(contagemPorAno)
        .map(ano => ({
            ano: ano,
            quantidade: contagemPorAno[Number(ano)]
        }))
        .sort((a, b) => Number(a.ano) - Number(b.ano))
        : undefined;
    };

    const dataGraficoLinha = dadosContratacao()
    
    return (
        <div style={{ width: '100%', height: '350px' }} className="mt-4">
            <h5>Número de contratações por ano</h5>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataGraficoLinha} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                        dataKey="ano" 
                        padding={{ left: 30, right: 30 }} 
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip 
                        labelStyle={{ color: '#333' }}
                        itemStyle={{ color: '#0d6efd' }}
                        formatter={(value: number | undefined) => {
                            if (typeof value === 'undefined') return ['0', 'Quantidade'];
                            return [`${value} contratações`, 'Quantidade'];
                        }}
                    />
                    <Legend />
                    <Line 
                        type="monotone" // Deixa a linha curvada e elegante
                        dataKey="quantidade" 
                        stroke="#0d6efd" // Azul do Bootstrap
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                        name="Novos Funcionários"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}