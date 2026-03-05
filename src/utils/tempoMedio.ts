import type { Funcionarios } from "../pages/Funcionarios/Funcionarios";

export const formatarTempo = (totalMeses: number) => {
    const anos = Math.floor(totalMeses / 12);
    const meses = totalMeses % 12;
    
    if (anos === 0) return `${meses} meses`;
    return `${anos} anos e ${meses} meses`; // Ex: 2a 4m (2 anos e 4 meses)
};

export const calcularTempoMedioCasa = (funcionarios : Funcionarios[]) => {
    if (funcionarios.length === 0) return 0;

    const hoje = new Date();
    
    const totalMeses = funcionarios.reduce((acc, func) => {
        if (!func.dataAdmissao) return acc;
        
        const dataAdmissao = new Date(func.dataAdmissao);
        
        const anos = hoje.getFullYear() - dataAdmissao.getFullYear();
        const meses = hoje.getMonth() - dataAdmissao.getMonth();
        
        const tempoEmMeses = (anos * 12) + meses;
        
        return acc + tempoEmMeses;
    }, 0);

    return Math.floor(totalMeses / funcionarios.length);
};