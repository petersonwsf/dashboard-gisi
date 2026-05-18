import { api } from "../../config/api/api"
import { useEffect, useState } from "react"
import { CARGOS, ESCOLARIDADE, SETORES } from "../../assets/consts/consts"
import { maskCurrency, unmaskCurrency } from "../../utils/maskCurrency"
import { handleAlertMessage } from "../../utils/handleAlertMessage"

interface Funcionario {
    nome?: string;
    salario?: number;
    cargo?: string;
    setor?: string;
    escolaridade?: string;
    sexo?: string;
    dataAdmissao?: string;
}

export default function ModalForm({ setReload, id, setId } : {setReload: (reload: boolean) => void, id?: number | string | null, setId: (id: number | string | null) => void}) {

    const [funcionario, setFuncionario] = useState<Funcionario>({})

    async function submitForm() {
        if (id) {
            try {
                await api.put(`/funcionarios/${id}`, funcionario)
                handleAlertMessage('Funcionário editado com sucesso!', 'success')
                setFuncionario({})
                setId(null)
                setReload(prev => !prev)
            } catch (error : any) {
                console.log(error)
                handleAlertMessage('Erro ao editar usuário', 'error')
            }
        } else {
            try {
                await api.post('/funcionarios', funcionario)
                handleAlertMessage('Funcionário cadastrado com sucesso!', 'success')
                setFuncionario({})
                setId(null)
                setReload(prev => !prev)
            } catch (error : any) {
                console.log(error)
                handleAlertMessage('Erro ao cadastrar usuário', 'error')
            }
        }
        
    }



    useEffect(() => {
        const fetchFuncionario = async () => {
            if (id) {
                try {
                    const response = await api.get(`/api/funcionarios/${id}`)
                    const data = response.data
                    setFuncionario({
                        nome: data.nome,
                        salario: data.salario,
                        cargo: data.cargo,
                        setor: data.setor,
                        escolaridade: data.escolaridade,
                        sexo: data.sexo,
                        dataAdmissao: data.dataAdmissao
                    })
                } catch (error) {
                    console.log(error)
                    handleAlertMessage('Erro ao carregar dados do funcionário', 'error')
                }
            } else {
                setFuncionario({})
            }
        }

        fetchFuncionario()
        
    }, [id])

    return (
        <div className="modal fade" id="modal_form_funcionarios" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Cadastrar funcionário</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            submitForm()
                        }}>
                            <div className="my-4">
                                <h6>Nome</h6>
                                <input type="text" value={funcionario.nome ?? ''} className="form-control" name="nome" id="nome" onChange={(e) => setFuncionario({...funcionario, [e.target.name] : e.target.value})} placeholder="Nome do funcionário" />
                            </div>
                            <div className="my-4 d-flex gap-3">
                                <div className="w-100">
                                    <h6>Setor</h6>
                                    <select name="setor" className="form-select" value={funcionario.setor ?? ''} onChange={(e) => setFuncionario({...funcionario, [e.target.name] : e.target.value})} aria-label="Default select example">
                                        {SETORES.map(setor => (
                                            <option value={setor.nome}>{setor.nome}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-100">
                                    <h6>Cargo</h6>
                                    <select className="form-select" value={funcionario.cargo ?? ''} onChange={(e) => setFuncionario({...funcionario, [e.target.name] : e.target.value})} name="cargo" aria-label="Default select example">
                                        {CARGOS.map(cargo => (
                                            <option value={cargo.nome}>{cargo.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                             <div className="my-4 d-flex gap-3">
                                <div className="w-100">
                                    <h6>Salário</h6>
                                    <input type="text" name="salario" value={funcionario.salario ? maskCurrency(funcionario.salario.toString()) : ''} 
                                    onChange={(e) => {
                                        const rawValue = unmaskCurrency(e.target.value)
                                        setFuncionario({...funcionario, [e.target.name] : rawValue})
                                    }} className="form-control" id="salario" placeholder="Salário" />
                                </div>
                                <div className="w-100">
                                    <h6>Data de Admissão</h6>
                                    <input 
                                        type="date" 
                                        name="dataAdmissao" 
                                        className="form-control" 
                                        onChange={(e) => setFuncionario({...funcionario, [e.target.name] : e.target.value})} 
                                        value={funcionario.dataAdmissao || ''}
                                    />
                                </div>
                            </div>
                            <div className="my-4">
                                <h6>Escolaridade</h6>
                                <select name="escolaridade" value={funcionario.escolaridade ?? ''} onChange={(e) => setFuncionario({...funcionario, [e.target.name] : e.target.value})} className="form-select" aria-label="Default select example">
                                    {ESCOLARIDADE.map(escolaridade => (
                                        <option value={escolaridade.nome}>{escolaridade.nome}</option>
                                    ))}
                                </select>
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
                            <div className="my-5 w-100 text-center">
                                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">{id ? 'Editar' : 'Cadastrar'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>  
    )
}