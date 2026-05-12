import { useEffect, useState } from 'react'
import { Funcionarios } from '../Funcionarios/Funcionarios'
import styles from './Dashboard.module.css'
import { api } from '../../config/api/api'
import { Pizza } from '../../components/Pizza/Pizza'
import { MediaSalarioSetor } from '../../components/GraficoBarras/MediaSalarioSetor'
import { Card } from '../../components/Card/Card'

import dinheiro_image from '../../assets/imgs/dinheiro.webp'
import person from '../../assets/imgs/person.png'
import maior_salario from '../../assets/imgs/maior_salario.png'
import relogio from '../../assets/imgs/relogio.png'

import { calcularTempoMedioCasa, formatarTempo } from '../../utils/tempoMedio'
import { GraficoLinhasAdmissao } from '../../components/GraficosLinhaAdmissao/GraficoLinhasAdmissao'
import { GraficoBarraEscolaridade } from '../../components/GraficoBarras/GraficoBarraEscolaridade'
import { GraficoCargoPizza } from '../../components/GraaficoPizzaCargo/GraficoCargoPizza'
import Filtros from '../../components/Filtros/Filtros'

interface Filtros {
    sexo?: string[];
    escolaridade?: string[];
    cargo?: string[];
    setor?: string[];
}

export function Dashboard() {

    const [funcionarios, setFuncionarios] = useState<Funcionarios[]>([])
    const [mediaSalario, setMediaSalario] = useState<number>(0)
    const [funcionarioMaiorSalario, setFuncionarioMaiorSalario] = useState<Funcionarios | null>(null)
    const [custoTotal, setCustoTotal] = useState<number>(0)

    const [filtros, setFiltros] = useState<Filtros>({
        sexo: [],
        escolaridade: [],
        cargo: [],
        setor: []
    })

    const [tempoMedio, setTempoMedio] = useState<number>(0)

    useEffect(() => {
        const fetch = async () => {

            const response = await api.get(`/funcionarios`)

            const filtrado = response.data.filter((f: Funcionarios) => {
                return Object.entries(filtros).every(([key, values]) => {
                    if (!values || values.length === 0) return true
                    return values.includes(f[key as keyof Funcionarios])
                })
            })

            setFuncionarios(filtrado)

            const somaSalarios = filtrado.reduce((acc, curr) => acc + curr.salario, 0);
            const media = somaSalarios / filtrado.length;
            setMediaSalario(media || 0)

            const funcionarioTop = filtrado.reduce((prev, current) => {
                return (prev?.salario ?? 0) > (current?.salario ?? 0) ? prev : current;
            }, filtrado[0]);

            setFuncionarioMaiorSalario(funcionarioTop)

            setTempoMedio(calcularTempoMedioCasa(filtrado))

            const custoTotal = filtrado.reduce((acc, f) => acc + (f.salario || 0), 0);
            setCustoTotal(custoTotal)
        }
        fetch()
    }, [filtros])

    return (
        <div className={styles.dashboard}>
            <h1><span className='text-primary'>G</span>I<span className='text-primary'>S</span>I Dashboard</h1>
            <div className="d-flex gap-3 align-items-start">
                <Filtros filtros={filtros} setFiltros={setFiltros} />
                <div>
                    <div className="d-flex justify-content-between flex-wrap gap-2 ">
                        <Card title='Média salarial' value={`R$ ${
                            new Intl.NumberFormat('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }).format(mediaSalario)}`} image={dinheiro_image}/>
                        <Card title='Número de funcionários' value={funcionarios.length} image={person}/>
                        <Card title='Custo mensal' value={`R$ ${
                            new Intl.NumberFormat('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }).format(custoTotal)}`} image={dinheiro_image}/>
                        <div className="card shadow border-0 bg-light" style={{width: '230px'}}>
                            <div className="card-body">
                                {funcionarioMaiorSalario &&
                                <>
                                    <div className="d-flex align-items-center">
                                        <img src={maior_salario} alt="Imagem" className={styles.image}/>
                                        <h5 className="card-title mt-3 w-100 text-center">Maior salário</h5>
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
                    <div className={`${styles.row} shadow bg-light`}>
                        <h5 className='fw-bold mb-3'>Média salarial por setor</h5>
                        <div className="d-flex justify-content-between">
                            <MediaSalarioSetor funcionarios={funcionarios}/>
                        </div>
                    </div>
                    <div className={`${styles.row} shadow bg-light`}>
                        <h5 className='fw-bold mb-3'>Distribuição por escolaridade</h5>
                        <div className="d-flex">
                            <GraficoBarraEscolaridade funcionarios={funcionarios}/>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className="d-flex justify-content-between flex-wrap">
                            <Pizza funcionarios={funcionarios}/>
                            <GraficoCargoPizza funcionarios={funcionarios} />
                        </div>
                    </div>
                    <div className={`${styles.row} shadow bg-light`}>
                        <h5 className='fw-bold mb-3'>Contratações por ano</h5>
                        <div className="d-flex justify-content-between">
                            {funcionarios && (
                                <>
                                    <GraficoLinhasAdmissao funcionarios={funcionarios}/>
                                </>
                            )}
                        </div>
                    </div>
                    <div className={`${styles.row} d-flex justify-content-center `}>
                        <div className="card shadow border-0 bg-light" style={{width: '450px', height: '250px'}}>
                            <div className='d-flex justify-content-center align-items-center'>
                                <img src={relogio} alt="Relógio" className={styles.image} />
                                <h5 className='fw-bold my-3'>Tempo médio de empresa</h5>
                            </div>
                            <div className='d-flex justify-content-center align-items-center h-75'>
                                <h4>{formatarTempo(tempoMedio)}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
