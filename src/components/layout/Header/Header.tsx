export function Header() {
    return (
        <header>
            <nav className="navbar bg-primary p-3 w-100" data-bs-theme="dark">
                <h1 className="text-light">GISI</h1>
                <div>
                    <div className="d-flex">
                        <button className="btn btn-primary mx-2 fs-5">Funcionários</button>
                        <button className="btn btn-primary mx-2 fs-5">Cadastrar funcionário</button>
                        <button className="btn btn-primary mx-2 fs-5">Dashboard</button>
                    </div>
                </div>
            </nav>
        </header>
    )
}