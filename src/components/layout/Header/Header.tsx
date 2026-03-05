import { Link } from "react-router-dom"

export function Header() {
    return (
        <header>
            <nav className="navbar bg-primary p-3 w-100" data-bs-theme="dark">
                <h1 className="text-light">GISI</h1>
                <div>
                    <div className="d-flex">
                        <Link to="/"><button className="btn btn-primary mx-2 fs-5">Funcionários</button></Link>
                        <Link to="/cadastro"><button className="btn btn-primary mx-2 fs-5">Cadastrar funcionário</button></Link>
                        <Link to="/dashboard" ><button className="btn btn-primary mx-2 fs-5">Dashboard</button></Link>
                    </div>
                </div>
            </nav>
        </header>
    )
}