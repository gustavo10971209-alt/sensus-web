import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { supabase } from '../services/supabase'
import { loginPsicologo } from '../services/authService'

import logoSensus from '../assets/LOGO-2.png'

function Login() {
  const navigate = useNavigate()

  // =======================================================
  // LOGIN
  // =======================================================

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erroLogin, setErroLogin] = useState('')

  // =======================================================
  // RECUPERAÇÃO DE SENHA
  // =======================================================

  const [modalRecuperacao, setModalRecuperacao] =
    useState(false)

  const [emailRecuperacao, setEmailRecuperacao] =
    useState('')

  const [emailEnviado, setEmailEnviado] =
    useState(false)

  const [enviandoRecuperacao, setEnviandoRecuperacao] =
    useState(false)

  // =======================================================
  // LOGIN
  // =======================================================

  async function fazerLogin(event) {
    event.preventDefault()

    if (!email.trim() || !senha) {
      setErroLogin(
        'Informe o e-mail e a senha.'
      )
      return
    }

    try {
      setCarregando(true)
      setErroLogin('')

      await loginPsicologo(
        email.trim(),
        senha
      )

      navigate('/dashboard', {
        replace: true,
      })
    } catch (error) {
      console.error(
        'Erro no login:',
        error
      )

      setErroLogin(
        error.message ||
          'Não foi possível entrar.'
      )
    } finally {
      setCarregando(false)
    }
  }

  // =======================================================
  // ABRIR / FECHAR RECUPERAÇÃO
  // =======================================================

  function abrirRecuperacao() {
    setModalRecuperacao(true)
    setEmailEnviado(false)
    setEmailRecuperacao('')
  }

  function fecharRecuperacao() {
    setModalRecuperacao(false)
    setEmailRecuperacao('')
    setEmailEnviado(false)
    setEnviandoRecuperacao(false)
  }

  // =======================================================
  // RECUPERAR SENHA
  // =======================================================

  async function recuperarSenha(event) {
    event.preventDefault()

    const emailInformado =
      emailRecuperacao.trim()

    if (!emailInformado) {
      return
    }

    try {
      setEnviandoRecuperacao(true)

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          emailInformado,
          {
            redirectTo:
              `${window.location.origin}/redefinir-senha`,
          }
        )

      if (error) {
        throw error
      }

      /*
        Mostramos uma resposta genérica.

        Isso evita informar publicamente
        se determinado e-mail existe
        ou não no sistema.
      */

      setEmailEnviado(true)
    } catch (error) {
      console.error(
        'Erro ao solicitar recuperação:',
        error
      )

      /*
        Mantemos a mesma resposta visual
        mesmo se o Supabase não concluir
        o envio.
      */

      setEmailEnviado(true)
    } finally {
      setEnviandoRecuperacao(false)
    }
  }

  // =======================================================
  // TELA
  // =======================================================

  return (
    <main className="pagina-login">
      <section className="card-login">

        {/* IDENTIDADE SENSUS */}

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

        <h1>
          Bem-vindo ao SENSUS
        </h1>

        <p className="subtitulo">
          Acesso exclusivo para
          profissionais autorizados
        </p>

        {/* LOGIN */}

        <form onSubmit={fazerLogin}>

          <div className="campo">
            <label htmlFor="email">
              E-mail
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(event) => {
                setEmail(
                  event.target.value
                )

                setErroLogin('')
              }}
              autoComplete="email"
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="senha">
              Senha
            </label>

            <input
              id="senha"
              name="senha"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(event) => {
                setSenha(
                  event.target.value
                )

                setErroLogin('')
              }}
              autoComplete="current-password"
              required
            />
          </div>

          {erroLogin && (
            <div
              className="login-erro"
              role="alert"
            >
              {erroLogin}
            </div>
          )}

          <button
            type="button"
            className="esqueci-senha botao-link"
            onClick={abrirRecuperacao}
          >
            Esqueci minha senha
          </button>

          <button
            className="botao-entrar"
            type="submit"
            disabled={carregando}
          >
            {carregando
              ? 'Entrando...'
              : 'Entrar'}
          </button>

        </form>
      </section>

      {/* ===================================================
          MODAL DE RECUPERAÇÃO
      =================================================== */}

      {modalRecuperacao && (
        <div
          className="modal-overlay"
          onClick={fecharRecuperacao}
        >
          <section
            className="modal-recuperacao"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="fechar-modal"
              onClick={fecharRecuperacao}
              aria-label="Fechar"
            >
              ×
            </button>

            {!emailEnviado ? (
              <>
                <span className="modal-etiqueta">
                  RECUPERAÇÃO DE SENHA
                </span>

                <h2>
                  Esqueceu sua senha?
                </h2>

                <p>
                  Informe o e-mail
                  associado à sua conta.
                  Enviaremos as instruções
                  para redefinir sua senha.
                </p>

                <form
                  onSubmit={recuperarSenha}
                >
                  <div className="campo">
                    <label htmlFor="email-recuperacao">
                      E-mail
                    </label>

                    <input
                      id="email-recuperacao"
                      name="email-recuperacao"
                      type="email"
                      placeholder="Digite seu e-mail"
                      value={
                        emailRecuperacao
                      }
                      onChange={(event) =>
                        setEmailRecuperacao(
                          event.target.value
                        )
                      }
                      required
                      autoFocus
                      autoComplete="email"
                    />
                  </div>

                  <button
                    type="submit"
                    className="botao-entrar"
                    disabled={
                      enviandoRecuperacao
                    }
                  >
                    {enviandoRecuperacao
                      ? 'Enviando...'
                      : 'Enviar instruções'}
                  </button>
                </form>
              </>
            ) : (
              <div className="recuperacao-sucesso">

                <div className="icone-sucesso">
                  ✓
                </div>

                <span className="modal-etiqueta">
                  SOLICITAÇÃO ENVIADA
                </span>

                <h2>
                  Verifique seu e-mail
                </h2>

                <p>
                  Se houver uma conta
                  autorizada associada a
                  esse endereço, você
                  receberá as instruções
                  para redefinir sua senha.
                </p>

                <button
                  type="button"
                  className="botao-entrar"
                  onClick={
                    fecharRecuperacao
                  }
                >
                  Voltar para o login
                </button>

              </div>
            )}
          </section>
        </div>
      )}
    </main>
  )
}

export default Login