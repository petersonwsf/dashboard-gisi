import { useEffect, useState } from "react";
import { api } from "../../config/api/api";
import { maskCurrency } from "../../utils/maskCurrency";

interface Funcionarios {
    id: string | number;
    nome?: string;
    salario?: number;
    cargo?: string;
    setor?: string;
    escolaridade?: string;
    sexo?: string;
}

export function Funcionarios() {
    
    const [funcionarios, setFuncionarios] = useState<Funcionarios[]>([])
    const [page, setPage] = useState<number>(1)
    const [infos, setInfos] = useState<any>(null)

    useEffect(() => {
        const fetchFuncionarios = async () => {
            const response = await api.get(`/funcionarios?_page=${page}`)
            setInfos(response.data)
            setFuncionarios(response.data.data);
        }
        fetchFuncionarios()
    }, [page])

    return (
        <div className="mb-5">
            <h2>Funcionários</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Nome</th>
                        <th scope="col">Setor</th>
                        <th scope="col">Cargo</th>
                        <th scope="col">Salário</th>
                        <th scope="col">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {funcionarios.map(funcionario => (
                        <tr key={funcionario.id}>
                            <th scope="row">{funcionario.id}</th>
                            <td>{funcionario.nome}</td>
                            <td>{funcionario.setor}</td>
                            <td>{funcionario.cargo}</td>
                            <td>R$ {funcionario.salario?.toString().replace('.', ',')}</td>
                            <td className="d-flex" style={{ gap: '1em'}}>
                                <button className="btn btn-primary">Editar</button>
                                <button className="btn btn-danger">Deletar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="d-flex justify-content-center w-100">
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        <li className={`page-item ${infos?.prev === null ? 'disabled' : ''}`} style={{cursor: 'pointer'}} onClick={() => infos?.prev !== null ? setPage(page => page - 1) : undefined}>
                            <a className="page-link">Previous</a>
                        </li>
                        <li className={`page-item`}><a className="page-link" style={{cursor: 'pointer'}}>{page}</a></li>
                        <li className={`page-item ${infos?.next === null ? 'disabled' : ''}`} style={{cursor: 'pointer'}} onClick={() => infos?.next !== null ? setPage(page => page + 1) : undefined}>
                            <a className="page-link">Next</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}