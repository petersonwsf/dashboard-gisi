import './App.css'
import { Header } from './components/layout/Header/Header'

import { Container } from './components/layout/Container/Container'

import { Routes, Route } from 'react-router-dom'
import { Cadastro } from './pages/Cadastro/Cadastro'
import { Funcionarios } from './pages/Funcionarios/Funcionarios'
import { Dashboard } from './pages/Dashboard/Dashboard'
import { AiConsultation } from './pages/AiConsultation/ai-consultation'
import Footer from './components/layout/Footer/Footer'

function App() {

  return (
    <>
      <Header />
      <Container>
        <Routes>
          <Route path='/' element={<Funcionarios />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/ai-consultation' element={<AiConsultation />} />
        </Routes>
      </Container>
      <Footer />
    </>
  )
}

export default App
