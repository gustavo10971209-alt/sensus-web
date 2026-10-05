import {
  Link,
  useNavigate,
} from 'react-router-dom'

import {
  topicosAjuda,
} from '../data/ajudaConteudo'

function Ajuda() {
  const navigate =
    useNavigate()

  function abrirPerfil() {
    navigate('/perfil')
  }

  function avisarBug() {
    window.open(
      'https://wa.me/5592988274824?text=Quero%20relatar%20um%20bug',
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <main className="pagina-ajuda">

      {/* NAVBAR */}

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

        <div className="dashboard-usuario">

          <button
            type="button"
            className="botao-perfil"
            onClick={abrirPerfil}
          >
            Perfil
          </button>

        </div>

      </header>

      {/* CENTRAL DE AJUDA */}

      <section className="ajuda-conteudo">

        <header className="ajuda-cabecalho">

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

        </header>

        {/* CARDS */}

        <div className="ajuda-grid">

          {topicosAjuda.map(
            (topico) => (
              <Link
                key={topico.slug}
                to={`/ajuda/${topico.slug}`}
                className="ajuda-card-link"
              >

                <article className="ajuda-card">

                  <span>
                    {topico.numero}
                  </span>

                  <h2>
                    {topico.titulo}
                  </h2>

                  <p>
                    {topico.resumo}
                  </p>

                  <div className="ajuda-card-abrir">
                    Ver guia
                    <strong>
                      →
                    </strong>
                  </div>

                </article>

              </Link>
            )
          )}

        </div>

        {/* SUPORTE */}

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