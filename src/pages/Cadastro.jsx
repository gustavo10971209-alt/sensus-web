import { Link } from 'react-router-dom'

function Cadastro() {
  return (
    <main className="pagina-cadastro">
      <section className="card-cadastro">
        <h1>Crie sua conta</h1>

        <p className="subtitulo">
          Cadastre-se no SENSUS
        </p>

        <form>
          <div className="campo">
            <label htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              type="text"
              placeholder="Digite seu nome completo"
            />
          </div>

          <div className="campo">
            <label htmlFor="emailCadastro">E-mail</label>
            <input
              id="emailCadastro"
              type="email"
              placeholder="Digite seu e-mail"
            />
          </div>

          <div className="campo">
            <label htmlFor="senhaCadastro">Senha</label>
            <input
              id="senhaCadastro"
              type="password"
              placeholder="Crie uma senha"
            />
          </div>

          <div className="campo">
            <label htmlFor="confirmarSenha">Confirmar senha</label>
            <input
              id="confirmarSenha"
              type="password"
              placeholder="Digite sua senha novamente"
            />
          </div>

          <button className="botao-entrar" type="submit">
            Cadastrar
          </button>

          <p className="ja-tem-conta">
            Já possui uma conta?
            <Link to="/login"> Fazer login</Link>
          </p>
        </form>
      </section>
    </main>
  )
}

export default Cadastro