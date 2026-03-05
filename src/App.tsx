import './App.css'
import { Header } from './components/layout/Header/Header'

import { Container } from './components/layout/Container/Container'

import { Routes, Route } from 'react-router-dom'
import { Cadastro } from './pages/Cadastro/Cadastro'
import { Funcionarios } from './pages/Funcionarios/Funcionarios'
import { Dashboard } from './pages/Dashboard/Dashboard'

function App() {

  return (
    <>
      <Header />
      <Container>
        <Routes>
          <Route path='/' element={<Funcionarios />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </Container>
    </>
  )
}

export default App
