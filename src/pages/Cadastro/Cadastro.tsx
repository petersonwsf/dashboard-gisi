import { useState } from "react"
import { CARGOS, SETORES, ESCOLARIDADE } from "../../assets/consts/consts";
import { api } from "../../config/api/api";
import { maskCurrency, unmaskCurrency } from "../../utils/maskCurrency";

interface Funcionario {
    nome?: string;
    salario?: number;
    cargo?: string;
    setor?: string;
    escolaridade?: string;
    sexo?: string;
}

export function Cadastro() {

    const [funcionario, setFuncionario] = useState<Funcionario>({})

    async function submitForm() {
        console.log(funcionario)
        return
        const response = await api.post('/funcionarios', funcionario)
        console.log(response.data)
    }

    return (
        <div className="mb-5">
            <h2>Cadastro de funcionário</h2>
            <form onSubmit={(e) => {
                e.preventDefault()
                submitForm()
            }}>
                <div className="my-4">
                    <h6>Nome</h6>
                    <input type="text" className="form-control" name="nome" id="nome" onChange={(e) => setFuncionario({...funcionario, [e.target.name] : e.target.value})} placeholder="Nome do funcionário" />
                </div>
                <div className="my-4">
                    <h6>Setor</h6>
                    <select name="setor" className="form-select" onChange={(e) => setFuncionario({...funcionario, [e.target.name] : e.target.value})} aria-label="Default select example">
                        {SETORES.map(setor => (
                            <option value={setor.nome}>{setor.nome}</option>
                        ))}
                    </select>
                </div>
                <div className="my-4">
                    <h6>Cargo</h6>
                    <select className="form-select" onChange={(e) => setFuncionario({...funcionario, [e.target.name] : e.target.value})} name="cargo" aria-label="Default select example">
                        {CARGOS.map(cargo => (
                            <option value={cargo.nome}>{cargo.nome}</option>
                        ))}
                    </select>
                </div>
                <div className="my-4">
                    <h6>Salário</h6>
                    <input type="text" name="salario" value={funcionario.salario ? maskCurrency(funcionario.salario.toString()) : ''} 
                    onChange={(e) => {
                        const rawValue = unmaskCurrency(e.target.value)
                        setFuncionario({...funcionario, [e.target.name] : rawValue})
                    }} className="form-control" id="salario" placeholder="Salário" />
                </div>
                <div className="my-4">
                    <h6>Sexo</h6>
                    <div className="form-check">
                        <input className="form-check-input" onChange={(e) => setFuncionario({...funcionario, [e.target.name] : e.target.value})} type="radio" value="Feminino" name="sexo" id="sexo1" checked={funcionario.sexo === "Feminino"}/>
                        <label className="form-check-label" htmlFor="sexo1">
                            Feminino
                        </label>
                        </div>
                        <div className="form-check">
                        <input className="form-check-input" onChange={(e) => setFuncionario({...funcionario, [e.target.name] : e.target.value})} type="radio" name="sexo" value="Masculino" id="sexo2" checked={funcionario.sexo === "Masculino"}/>
                        <label className="form-check-label" htmlFor="sexo2">
                            Masculino
                        </label>
                    </div>
                </div>
                <div className="my-4">
                    <h6>Escolaridade</h6>
                    <select name="escolaridade" onChange={(e) => setFuncionario({...funcionario, [e.target.name] : e.target.value})} className="form-select" aria-label="Default select example">
                        {ESCOLARIDADE.map(escolaridade => (
                            <option value={escolaridade.nome}>{escolaridade.nome}</option>
                        ))}
                    </select>
                </div>
                <div className="my-5">
                    <button type="submit" className="btn btn-primary">Cadastrar</button>
                </div>
            </form>
        </div>
    )
}