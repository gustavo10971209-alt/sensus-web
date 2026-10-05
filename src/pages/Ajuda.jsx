import {
  Link,
  useNavigate,
} from 'react-router-dom'

function Ajuda() {
  const navigate = useNavigate()

  function voltar() {
    navigate('/dashboard')
  }

  function avisarBug() {
    window.open(
      'https://web.whatsapp.com/send/?phone=5592988274824&text=Quero+relatar+um+bug&type=phone_number&app_absent=0',
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <main className="pagina-ajuda">

      <header className="dashboard-header">

        <div className="dashboard-marca">
          SENSUS-MAP
        </div>

        <nav className="dashboard-nav">

          <Link to="/dashboard">
            Início
          </Link>

          <Link to="/pacientes">
            Pacientes
          </Link>

          <Link to="/agendamentos">
            Agenda
          </Link>

          <Link to="/relatorios">
            Relatórios
          </Link>

        </nav>

        <button
          type="button"
          className="botao-perfil"
          onClick={voltar}
        >
          Voltar
        </button>

      </header>

      <section className="ajuda-conteudo">

        <div className="ajuda-cabecalho">

          <span>
            CENTRAL DE AJUDA
          </span>

          <h1>
            Como utilizar o SENSUS-MAP
          </h1>

          <p>
            Conheça as principais áreas
            do sistema e o que você pode
            fazer em cada uma delas.
          </p>

        </div>

        <div className="ajuda-grid">

          <article className="ajuda-card">
            <span>01</span>

            <h2>
              Início
            </h2>

            <p>
              Visualize rapidamente um
              paciente, acompanhe seus
              registros emocionais,
              consulte o gráfico e
              registre observações.
            </p>
          </article>

          <article className="ajuda-card">
            <span>02</span>

            <h2>
              Pacientes
            </h2>

            <p>
              Consulte os dados dos
              pacientes, registros
              emocionais e anotações
              realizadas durante o
              acompanhamento.
            </p>
          </article>

          <article className="ajuda-card">
            <span>03</span>

            <h2>
              Agenda
            </h2>

            <p>
              Crie e organize
              agendamentos, consulte
              consultas futuras e
              acompanhe quem criou ou
              alterou cada registro.
            </p>
          </article>

          <article className="ajuda-card">
            <span>04</span>

            <h2>
              Relatórios
            </h2>

            <p>
              Gere análises dos registros
              emocionais, escolha períodos
              específicos e exporte os
              resultados em PDF.
            </p>
          </article>

          <article className="ajuda-card">
            <span>05</span>

            <h2>
              Anotações
            </h2>

            <p>
              Registre observações sobre
              os pacientes. As anotações
              ficam associadas ao paciente
              e ao psicólogo responsável.
            </p>
          </article>

          <article className="ajuda-card">
            <span>06</span>

            <h2>
              Perfil
            </h2>

            <p>
              Consulte e atualize seus
              dados profissionais, como
              nome, CRP e telefone, além
              de alterar sua senha.
            </p>
          </article>

        </div>

        <section className="ajuda-bug">

          <div>
            <span>
              SUPORTE
            </span>

            <h2>
              Encontrou algum problema?
            </h2>

            <p>
              Avise sobre erros ou
              comportamentos inesperados
              encontrados no SENSUS-MAP.
            </p>
          </div>

          <button
            type="button"
            className="ajuda-bug-botao"
            onClick={avisarBug}
          >
            Avisar um bug
          </button>

        </section>

      </section>

    </main>
  )
}

export default Ajuda