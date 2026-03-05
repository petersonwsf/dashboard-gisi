import { useEffect, useState } from 'react'
import { Funcionarios } from '../Funcionarios/Funcionarios'
import styles from './Dashboard.module.css'
import { api } from '../../config/api/api'
import { Pizza } from '../../components/Pizza/Pizza'
import { MediaSalarioSetor } from '../../components/GraficoBarras/MediaSalarioSetor'
import { Card } from '../../components/Card/Card'
import { maskCurrency } from '../../utils/maskCurrency'

import dinheiro_image from '../../assets/imgs/dinheiro.webp'
import person from '../../assets/imgs/person.png'
import maior_salario from '../../assets/imgs/maior_salario.png'
import relogio from '../../assets/imgs/relogio.png'

import { calcularTempoMedioCasa, formatarTempo } from '../../utils/tempoMedio'
import { GraficoLinhasAdmissao } from '../../components/GraficosLinhaAdmissao/GraficoLinhasAdmissao'
import { GraficoBarraEscolaridade } from '../../components/GraficoBarras/GraficoBarraEscolaridade'
import { GraficoCargoPizza } from '../../components/GraaficoPizzaCargo/GraficoCargoPizza'
import { CARGOS, ESCOLARIDADE, SETORES } from '../../assets/consts/consts'

interface Filtros {
    sexo?: string;
    escolaridade?: string;
    cargo?: string;
    setor?: string;
}

export function Dashboard() {

    const [funcionarios, setFuncionarios] = useState<Funcionarios[]>([])
    const [mediaSalario, setMediaSalario] = useState<number>(0)
    const [funcionarioMaiorSalario, setFuncionarioMaiorSalario] = useState<Funcionarios | null>(null)
    const [custoTotal, setCustoTotal] = useState<number>(0)

    const [filtros, setFiltros] = useState<Filtros>({
        sexo: '',
        escolaridade: '',
        cargo: '',
        setor: ''
    })

    const [tempoMedio, setTempoMedio] = useState<number>(0)

    useEffect(() => {
        const fetch = async () => {
            const params = {} as any

            if (filtros.escolaridade) params.escolaridade = filtros.escolaridade
            if (filtros.setor) params.setor = filtros.setor
            if (filtros.cargo) params.cargo = filtros.cargo
            if (filtros.sexo) params.sexo = filtros.sexo

            const response = await api.get(`/funcionarios`, { params })
            console.log(response.data)
            setFuncionarios(response.data)

            const somaSalarios = response.data?.reduce((acc, curr) => acc + curr.salario, 0);
            const media = somaSalarios! / response.data!.length;
            setMediaSalario(media || 0)

            const funcionarioTop = response.data?.reduce((prev, current) => {
                return (prev?.salario ?? 0) > (current?.salario ?? 0) ? prev : current;
            }, funcionarios[0]);

            setFuncionarioMaiorSalario(funcionarioTop)

            setTempoMedio(calcularTempoMedioCasa(response.data as Funcionarios[]))

            const custoTotal = response.data?.reduce((acc, f) => acc + (f.salario || 0), 0);
            setCustoTotal(custoTotal)
        }
        fetch()
    }, [filtros])

    return (
        <div className={styles.dashboard}>
            <h1><span className='text-primary'>G</span>I<span className='text-primary'>S</span>I Dashboard</h1>
            <div className='d-flex my-3 justify-content-between gap-3 shadow px-4 py-3'>
                <div className='w-100'>
                    <h6>Sexo</h6>
                    <select className="form-select" onChange={(e) => setFiltros({...filtros, sexo: e.target.value === 'default' ? undefined : e.target.value})} aria-label="Default select example">
                        <option value="default">Padrão</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                    </select>
                </div>
                <div className='w-100'>
                    <h6>Cargo</h6>
                    <select className="form-select" onChange={(e) => setFiltros({...filtros, cargo: e.target.value === 'default' ? undefined : e.target.value})} aria-label="Default select example">
                        <option value="default">Padrão</option>
                        {CARGOS.map(cargo => (
                            <option value={cargo.nome}>{cargo.nome}</option>
                        ))}
                    </select>
                </div>
                <div className='w-100'>
                    <h6>Setor</h6>
                    <select className="form-select" onChange={(e) => setFiltros({...filtros, setor: e.target.value === 'default' ? undefined : e.target.value})} aria-label="Default select example">
                        <option value="default">Padrão</option>
                        {SETORES.map(setor => (
                            <option value={setor.nome}>{setor.nome}</option>
                        ))}
                    </select>
                </div>
                <div className='w-100'>
                    <h6>Escolaridade</h6>
                    <select className="form-select" onChange={(e) => setFiltros({...filtros, escolaridade: e.target.value === 'default' ? undefined : e.target.value})} aria-label="Default select example">
                        <option value="default">Padrão</option>
                        {ESCOLARIDADE.map(escolaridade => (
                            <option value={escolaridade.nome}>{escolaridade.nome}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="d-flex mt-5 gap-3 justify-content-between">
                <Card title='Média de salário dos funcionários' value={`R$ ${
                    new Intl.NumberFormat('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(mediaSalario)}`} image={dinheiro_image}/>
                <Card title='Número de funcionários' value={funcionarios.length} image={person}/>
                <Card title='Custo mensal da folha' value={`R$ ${
                    new Intl.NumberFormat('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(custoTotal)}`} image={dinheiro_image}/>
                <div className="card shadow border-0" style={{minHeight: '200px', minWidth: '350px'}}>
                    <div className="card-body">
                        {funcionarioMaiorSalario &&
                        <>
                            <div className="d-flex g-3 align-items-center">
                                <img src={maior_salario} alt="Imagem" className={styles.image}/>
                                <h5 className="card-title fw-bold mt-3 w-100 text-center">Maior salário</h5>
                            </div>
                            <div className="d-flex flex-column justify-content-start mt-3 h-50">
                                <h6>Nome: {funcionarioMaiorSalario.nome}</h6>
                                <h6>Setor: {funcionarioMaiorSalario.setor}</h6>
                                <h6>Cargo: {funcionarioMaiorSalario.cargo}</h6>
                                <h6>Salário: {`R$ ${
                                    new Intl.NumberFormat('pt-BR', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }).format(funcionarioMaiorSalario.salario)}`}
                                </h6>
                            </div>
                        </>
                        }
                    </div>
                </div>
            </div>
            <div className={styles.row}>
                <div className="d-flex justify-content-between">
                    <Pizza funcionarios={funcionarios}/>
                    <MediaSalarioSetor funcionarios={funcionarios}/>
                </div>
            </div>
            <div className={styles.row}>
                <div className="d-flex justify-content-between gap-5">
                    <Card title='Tempo médio dos funcionários na empresa' value={formatarTempo(tempoMedio)} image={relogio}/>
                    {funcionarios && (
                        <>
                            <GraficoLinhasAdmissao funcionarios={funcionarios}/>
                        </>
                    )}
                </div>
            </div>
            <div className={styles.row}>
                <div className="d-flex gap-5">
                    <GraficoBarraEscolaridade funcionarios={funcionarios}/>
                </div>
            </div>
            <div className='my-5'>
                <div className="d-flex w-100 justify-content-center">
                    <GraficoCargoPizza funcionarios={funcionarios} />
                </div>
            </div>
            <br /><br />
        </div>
    )
}