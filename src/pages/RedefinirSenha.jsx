import { useState } from 'react'
import {
  useNavigate,
} from 'react-router-dom'

import { supabase } from '../services/supabase'

import logoSensus from '../assets/LOGO-2.png'

function RedefinirSenha() {
  const navigate =
    useNavigate()

  const [
    senha,
    setSenha,
  ] = useState('')

  const [
    confirmarSenha,
    setConfirmarSenha,
  ] = useState('')

  const [
    erro,
    setErro,
  ] = useState('')

  const [
    sucesso,
    setSucesso,
  ] = useState(false)

  const [
    carregando,
    setCarregando,
  ] = useState(false)

  async function alterarSenha(
    event
  ) {
    event.preventDefault()

    setErro('')

    if (senha.length < 6) {
      setErro(
        'A senha deve possuir pelo menos 6 caracteres.'
      )

      return
    }

    if (
      senha !==
      confirmarSenha
    ) {
      setErro(
        'As senhas não são iguais.'
      )

      return
    }

    try {
      setCarregando(true)

      const {
        error,
      } =
        await supabase.auth.updateUser({
          password: senha,
        })

      if (error) {
        throw error
      }

      setSucesso(true)

      /*
        Encerramos a sessão criada
        pelo link de recuperação.
      */
      await supabase.auth.signOut()

    } catch (error) {
      console.error(
        'Erro ao alterar senha:',
        error
      )

      setErro(
        'Não foi possível alterar a senha. O link pode ter expirado.'
      )
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="pagina-login">

      <section className="card-login">

        <div className="login-identidade">

          <img
            src={logoSensus}
            alt="Logo SENSUS"
            className="login-logo"
          />

          <span className="login-nome">
            SENSUS
          </span>

        </div>

        {!sucesso ? (
          <>

            <h1>
              Nova senha
            </h1>

            <p className="subtitulo">
              Defina uma nova senha
              para acessar sua conta.
            </p>

            <form
              onSubmit={
                alterarSenha
              }
            >

              <div className="campo">

                <label htmlFor="nova-senha">
                  Nova senha
                </label>

                <input
                  id="nova-senha"
                  type="password"
                  value={senha}
                  onChange={(
                    event
                  ) =>
                    setSenha(
                      event.target.value
                    )
                  }
                  placeholder="Digite a nova senha"
                  autoComplete="new-password"
                  required
                />

              </div>

              <div className="campo">

                <label htmlFor="confirmar-senha">
                  Confirmar senha
                </label>

                <input
                  id="confirmar-senha"
                  type="password"
                  value={
                    confirmarSenha
                  }
                  onChange={(
                    event
                  ) =>
                    setConfirmarSenha(
                      event.target.value
                    )
                  }
                  placeholder="Digite novamente"
                  autoComplete="new-password"
                  required
                />

              </div>

              {erro && (
                <div
                  className="login-erro"
                  role="alert"
                >
                  {erro}
                </div>
              )}

              <button
                type="submit"
                className="botao-entrar"
                disabled={
                  carregando
                }
              >
                {carregando
                  ? 'Alterando...'
                  : 'Alterar senha'}
              </button>

            </form>

          </>
        ) : (
          <div className="recuperacao-sucesso">

            <div className="icone-sucesso">
              ✓
            </div>

            <span className="modal-etiqueta">
              SENHA ALTERADA
            </span>

            <h2>
              Tudo certo
            </h2>

            <p>
              Sua senha foi alterada
              com sucesso.
            </p>

            <button
              type="button"
              className="botao-entrar"
              onClick={() =>
                navigate(
                  '/login',
                  {
                    replace: true,
                  }
                )
              }
            >
              Entrar no SENSUS
            </button>

          </div>
        )}

      </section>

    </main>
  )
}

export default RedefinirSenha