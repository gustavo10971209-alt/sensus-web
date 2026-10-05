import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import './App.css'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Agendamentos from './pages/Agendamentos'
import Pacientes from './pages/Pacientes'
import Relatorios from './pages/Relatorios'
import RedefinirSenha from './pages/RedefinirSenha'
import Perfil from './pages/Perfil'
import Ajuda from './pages/Ajuda'
import AjudaDetalhe
  from './pages/AjudaDetalhe'

import RotaProtegida from './components/RotaProtegida'

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ===============================================
            ROTAS PÚBLICAS
        =============================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/redefinir-senha"
          element={
            <RedefinirSenha />
          }
        />

        {/* ===============================================
            ROTAS PROTEGIDAS
        =============================================== */}

        <Route
          path="/dashboard"
          element={
            <RotaProtegida>
              <Dashboard />
            </RotaProtegida>
          }
        />

        <Route
          path="/pacientes"
          element={
            <RotaProtegida>
              <Pacientes />
            </RotaProtegida>
          }
        />

        <Route
          path="/pacientes/:pacienteId"
          element={
            <RotaProtegida>
              <Pacientes />
            </RotaProtegida>
          }
        />

        <Route
          path="/agendamentos"
          element={
            <RotaProtegida>
              <Agendamentos />
            </RotaProtegida>
          }
        />

        <Route
          path="/relatorios"
          element={
            <RotaProtegida>
              <Relatorios />
            </RotaProtegida>
          }
        />

        <Route
          path="/perfil"
          element={
            <RotaProtegida>
              <Perfil />
            </RotaProtegida>
          }
        />

        <Route
          path="/ajuda"
          element={
            <RotaProtegida>
              <Ajuda />
            </RotaProtegida>
          }
        />

        <Route
  path="/ajuda/:secao"
  element={
    <RotaProtegida>
      <AjudaDetalhe />
    </RotaProtegida>
  }
/>

        {/* ===============================================
            REDIRECIONAMENTOS
        =============================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App