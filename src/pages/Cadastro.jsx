import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Cadastro() {
  const navigate = useNavigate()
  const [cadastroConcluido, setCadastroConcluido] = useState(false)

  function fazerCadastro(event) {
    event.preventDefault()

    // Cadastro temporário.
    // Depois será substituído pelo cadastro real no Supabase.
    setCadastroConcluido(true)
  }

  function irParaLogin() {
    navigate('/login')
  }

  return (
    <main className="pagina-cadastro">
      <section className="card-cadastro">
        <h1>Crie sua conta</h1>

        <p className="subtitulo">
          Cadastre-se no SENSUS
        </p>

        <form onSubmit={fazerCadastro}>
          <div className="campo">
            <label htmlFor="nome">
              Nome completo
            </label>

            <input
              id="nome"
              type="text"
              placeholder="Digite seu nome completo"
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="emailCadastro">
              E-mail
            </label>

            <input
              id="emailCadastro"
              type="email"
              placeholder="Digite seu e-mail"
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="senhaCadastro">
              Senha
            </label>

            <input
              id="senhaCadastro"
              type="password"
              placeholder="Crie uma senha"
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="confirmarSenha">
              Confirmar senha
            </label>

            <input
              id="confirmarSenha"
              type="password"
              placeholder="Digite sua senha novamente"
              required
            />
          </div>

          <button
            className="botao-entrar"
            type="submit"
          >
            Cadastrar
          </button>

          <p className="ja-tem-conta">
            Já possui uma conta?
            <Link to="/login">
              {' '}Fazer login
            </Link>
          </p>
        </form>
      </section>

      {cadastroConcluido && (
        <div className="modal-overlay">
          <section className="modal-cadastro-sucesso">
            <div className="icone-sucesso">
              ✓
            </div>

            <span className="modal-etiqueta">
              CADASTRO CONCLUÍDO
            </span>

            <h2>Cadastro realizado com sucesso!</h2>

            <p>
              Sua conta foi criada. Agora você pode
              acessar o SENSUS utilizando seus dados.
            </p>

            <button
              type="button"
              className="botao-entrar"
              onClick={irParaLogin}
            >
              Ir para o login
            </button>
          </section>
        </div>
      )}
    </main>
  )
}

export default Cadastro