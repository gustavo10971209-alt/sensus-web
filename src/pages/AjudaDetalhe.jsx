import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'

import {
  buscarTopicoAjuda,
  topicosAjuda,
} from '../data/ajudaConteudo'

function AjudaDetalhe() {
  const navigate =
    useNavigate()

  const {
    secao,
  } = useParams()

  const topico =
    buscarTopicoAjuda(
      secao
    )

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

  // =========================================
  // TÓPICO NÃO ENCONTRADO
  // =========================================

  if (!topico) {
    return (
      <main className="pagina-ajuda">

        <section className="ajuda-conteudo">

          <div className="ajuda-nao-encontrada">

            <span>
              CENTRAL DE AJUDA
            </span>

            <h1>
              Tópico não encontrado
            </h1>

            <p>
              O conteúdo solicitado não
              está disponível.
            </p>

            <Link
              to="/ajuda"
              className="ajuda-voltar"
            >
              ← Voltar para a Central
              de Ajuda
            </Link>

          </div>

        </section>

      </main>
    )
  }

  // =========================================
  // NAVEGAÇÃO ENTRE TÓPICOS
  // =========================================

  const indiceAtual =
    topicosAjuda.findIndex(
      (item) =>
        item.slug ===
        topico.slug
    )

  const anterior =
    indiceAtual > 0
      ? topicosAjuda[
          indiceAtual - 1
        ]
      : null

  const proximo =
    indiceAtual <
    topicosAjuda.length - 1
      ? topicosAjuda[
          indiceAtual + 1
        ]
      : null

  // =========================================
  // TELA
  // =========================================

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

      {/* CONTEÚDO */}

      <section className="ajuda-conteudo ajuda-detalhe">

        <Link
          to="/ajuda"
          className="ajuda-voltar"
        >
          ← Central de Ajuda
        </Link>

        <header className="ajuda-detalhe-cabecalho">

          <span>
            AJUDA • {topico.numero}
          </span>

          <h1>
            {topico.tituloPagina}
          </h1>

          <p>
            {topico.introducao}
          </p>

        </header>

        {/* SEÇÕES */}

        <div className="ajuda-detalhe-secoes">

          {topico.secoes.map(
            (secaoAtual, index) => (
              <article
                className="ajuda-detalhe-secao"
                key={`${topico.slug}-${index}`}
              >

                <div className="ajuda-detalhe-numero">
                  {String(
                    index + 1
                  ).padStart(
                    2,
                    '0'
                  )}
                </div>

                <div className="ajuda-detalhe-texto">

                  <h2>
                    {secaoAtual.titulo}
                  </h2>

                  <p>
                    {secaoAtual.texto}
                  </p>

                  {secaoAtual.itens &&
                    secaoAtual.itens
                      .length > 0 && (
                      <ul>
                        {secaoAtual.itens.map(
                          (
                            item,
                            itemIndex
                          ) => (
                            <li
                              key={
                                itemIndex
                              }
                            >
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    )}

                  {secaoAtual.aviso && (
                    <div className="ajuda-detalhe-aviso">

                      <strong>
                        Importante
                      </strong>

                      <p>
                        {
                          secaoAtual
                            .aviso
                        }
                      </p>

                    </div>
                  )}

                </div>

              </article>
            )
          )}

        </div>

        {/* ANTERIOR / PRÓXIMO */}

        <nav className="ajuda-detalhe-navegacao">

          <div>

            {anterior && (
              <Link
                to={`/ajuda/${anterior.slug}`}
                className="ajuda-navegacao-item ajuda-navegacao-anterior"
              >

                <span>
                  ← Anterior
                </span>

                <strong>
                  {anterior.numero} •{' '}
                  {anterior.titulo}
                </strong>

              </Link>
            )}

          </div>

          <div>

            {proximo && (
              <Link
                to={`/ajuda/${proximo.slug}`}
                className="ajuda-navegacao-item ajuda-navegacao-proximo"
              >

                <span>
                  Próximo →
                </span>

                <strong>
                  {proximo.numero} •{' '}
                  {proximo.titulo}
                </strong>

              </Link>
            )}

          </div>

        </nav>

        {/* SUPORTE */}

        <section className="ajuda-bug">

          <div>

            <span>
              SUPORTE
            </span>

            <h2>
              Ainda precisa de ajuda?
            </h2>

            <p>
              Caso tenha encontrado um
              erro ou comportamento
              inesperado, avise nossa
              equipe.
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

export default AjudaDetalhe