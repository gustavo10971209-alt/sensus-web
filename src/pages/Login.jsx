import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [modalRecuperacao, setModalRecuperacao] = useState(false)
  const [emailRecuperacao, setEmailRecuperacao] = useState('')
  const [emailEnviado, setEmailEnviado] = useState(false)

  function fazerLogin(event) {
    event.preventDefault()

    // Login temporário.
    // Depois será substituído pela autenticação real.
    navigate('/dashboard')
  }

  function abrirRecuperacao() {
    setModalRecuperacao(true)
    setEmailEnviado(false)
  }

  function fecharRecuperacao() {
    setModalRecuperacao(false)
    setEmailRecuperacao('')
    setEmailEnviado(false)
  }

  function recuperarSenha(event) {
    event.preventDefault()

    if (!emailRecuperacao.trim()) {
      return
    }

    // Simulação temporária do envio do e-mail.
    setEmailEnviado(true)
  }

  return (
    <main className="pagina-login">
      <section className="card-login">
        <h1>Bem-vindo ao SENSUS</h1>

        <p className="subtitulo">
          Entre na sua conta para continuar
        </p>

        <form onSubmit={fazerLogin}>
          <div className="campo">
            <label htmlFor="email">
              E-mail
            </label>

            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
            />
          </div>

          <div className="campo">
            <label htmlFor="senha">
              Senha
            </label>

            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
            />
          </div>

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
          >
            Entrar
          </button>

          <div className="divisor">
            <span>ou</span>
          </div>

          <Link
            className="botao-cadastro link-botao"
            to="/cadastro"
          >
            Criar uma conta
          </Link>
        </form>
      </section>

      {modalRecuperacao && (
        <div
          className="modal-overlay"
          onClick={fecharRecuperacao}
        >
          <section
            className="modal-recuperacao"
            onClick={(event) => event.stopPropagation()}
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

                <h2>Esqueceu sua senha?</h2>

                <p>
                  Informe o e-mail associado à sua conta.
                  Enviaremos as instruções para redefinir sua senha.
                </p>

                <form onSubmit={recuperarSenha}>
                  <div className="campo">
                    <label htmlFor="email-recuperacao">
                      E-mail
                    </label>

                    <input
                      id="email-recuperacao"
                      type="email"
                      placeholder="Digite seu e-mail"
                      value={emailRecuperacao}
                      onChange={(event) =>
                        setEmailRecuperacao(event.target.value)
                      }
                      required
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    className="botao-entrar"
                  >
                    Enviar instruções
                  </button>
                </form>
              </>
            ) : (
              <div className="recuperacao-sucesso">
                <div className="icone-sucesso">
                  ✓
                </div>

                <span className="modal-etiqueta">
                  E-MAIL ENVIADO
                </span>

                <h2>Verifique seu e-mail</h2>

                <p>
                  As instruções de recuperação foram enviadas
                  para:
                </p>

                <strong>
                  {emailRecuperacao}
                </strong>

                <button
                  type="button"
                  className="botao-entrar"
                  onClick={fecharRecuperacao}
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