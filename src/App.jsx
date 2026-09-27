import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import './App.css'

import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Dashboard from './pages/Dashboard'
import Agendamentos from './pages/Agendamentos'
import Pacientes from './pages/Pacientes'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/cadastro"
          element={<Cadastro />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Página geral de pacientes */}

        <Route
          path="/pacientes"
          element={<Pacientes />}
        />

        {/* Paciente específico vindo do Dashboard */}

        <Route
          path="/pacientes/:pacienteId"
          element={<Pacientes />}
        />

        <Route
          path="/agendamentos"
          element={<Agendamentos />}
        />

        <Route
          path="/"
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