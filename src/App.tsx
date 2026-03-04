import './App.css'
import { Header } from './components/layout/Header/Header'

import { Container } from './components/layout/Container/Container'

import { Routes, Route } from 'react-router-dom'
import { Cadastro } from './pages/Cadastro/Cadastro'

function App() {

  return (
    <>
      <Header />
      <Container>
        <Routes>
          <Route path='/' element={<Cadastro />} />
        </Routes>
      </Container>
    </>
  )
}

export default App
