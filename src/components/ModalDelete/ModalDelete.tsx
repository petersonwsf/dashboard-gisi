import { api } from "../../config/api/api"
import { handleAlertMessage } from "../../utils/handleAlertMessage"

export default function ModalDelete({ id, setReload } : {id: number | string | null, setReload: (value: boolean) => void}) {

    async function deleteFuncionario() {
        try {
            await api.delete(`/funcionarios/${id}`)
            handleAlertMessage('Funcionário deletado com sucesso!', 'success')
            setReload(prev => !prev)
        } catch (error) {
            console.log(error)
            handleAlertMessage('Erro ao deletar funcionário', 'error')
        }
    }

    return (
        <div className="modal fade" id="modal_delete_funcionario" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Deletar funcionário</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p className="lead">Tem certeza que deseja deletar este funcionário?</p>
                        <div className="mt-5  w-100 text-center">
                            <button className="btn btn-danger" data-bs-dismiss="modal" onClick={deleteFuncionario}>
                                Deletar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
    )
}