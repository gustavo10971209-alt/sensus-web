import {
  useEffect,
  useState,
} from 'react'

import {
  Navigate,
} from 'react-router-dom'

import {
  buscarPsicologoLogado,
  logoutPsicologo,
} from '../services/authService'

function RotaProtegida({
  children,
}) {
  const [
    verificando,
    setVerificando,
  ] = useState(true)

  const [
    autorizado,
    setAutorizado,
  ] = useState(false)

  useEffect(() => {
    async function verificarAcesso() {
      try {
        const psicologo =
          await buscarPsicologoLogado()

        if (!psicologo) {
          await logoutPsicologo()

          setAutorizado(false)
          return
        }

        setAutorizado(true)
      } catch (error) {
        console.error(
          'Erro ao verificar acesso:',
          error
        )

        try {
          await logoutPsicologo()
        } catch {
          // Ignora erro ao encerrar
          // uma sessão inválida.
        }

        setAutorizado(false)
      } finally {
        setVerificando(false)
      }
    }

    verificarAcesso()
  }, [])

  // Enquanto consulta Supabase,
  // não mostramos a página protegida.

  if (verificando) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p>
          Verificando acesso...
        </p>
      </main>
    )
  }

  // Sem psicólogo válido:
  // volta para o login.

  if (!autorizado) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  // Psicólogo autenticado e ativo:
  // libera a página.

  return children
}

export default RotaProtegida