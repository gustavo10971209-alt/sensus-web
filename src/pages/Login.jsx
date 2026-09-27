import { Link } from 'react-router-dom'

function Login() {
  return (
    <main className="pagina-login">
      <section className="card-login">
        <h1>Bem-vindo ao SENSUS</h1>

        <p className="subtitulo">
          Entre na sua conta para continuar
        </p>

        <form>
          <div className="campo">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
            />
          </div>

          <div className="campo">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
            />
          </div>

          <Link className="esqueci-senha" to="/recuperar-senha">
            Esqueci minha senha
          </Link>

          <button className="botao-entrar" type="submit">
            Entrar
          </button>

          <div className="divisor">
            <span>ou</span>
          </div>

          <Link className="botao-cadastro link-botao" to="/cadastro">
            Criar uma conta
          </Link>
        </form>
      </section>
    </main>
  )
}

export default Login