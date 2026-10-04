import { useState } from 'react'

const relatoriosDisponiveis = [
  {
    id: '001',
    nome: 'Comparativo semanal de emoções',
    descricaoCurta:
      'Compare as emoções registradas durante os dias de uma semana.',
  },
  {
    id: '002',
    nome: 'Emoções predominantes',
    descricaoCurta:
      'Identifique as emoções mais frequentes em um período.',
  },
  {
    id: '003',
    nome: 'Emoções por horário do dia',
    descricaoCurta:
      'Analise os registros emocionais de acordo com os horários do dia.',
  },
  {
    id: '004',
    nome: 'Evolução emocional',
    descricaoCurta:
      'Acompanhe como os registros emocionais mudam ao longo do tempo.',
  },
  {
    id: '005',
    nome: 'Frequência emocional',
    descricaoCurta:
      'Visualize a quantidade e a proporção de cada emoção registrada.',
  },
  {
    id: '006',
    nome: 'Resumo emocional do período',
    descricaoCurta:
      'Veja os principais indicadores emocionais reunidos em uma visão geral.',
  },
]

function MenuRelatorios({
  relatorioSelecionado,
  onSelecionarRelatorio,
}) {
  const [pesquisa, setPesquisa] =
    useState('')

  const pesquisaNormalizada =
    pesquisa.trim().toLowerCase()

  const relatoriosFiltrados =
    relatoriosDisponiveis.filter(
      (relatorio) => {
        const numero =
          relatorio.id.toLowerCase()

        const nome =
          relatorio.nome.toLowerCase()

        return (
          numero.includes(
            pesquisaNormalizada
          ) ||
          nome.includes(
            pesquisaNormalizada
          )
        )
      }
    )

  return (
    <aside className="relatorios-menu">
      <div className="relatorios-menu-cabecalho">
        <span>
          RELATÓRIOS
        </span>

        <h2>
          Biblioteca
        </h2>

        <p>
          Selecione o tipo de análise que
          deseja visualizar.
        </p>
      </div>

      {/* PESQUISA */}

      <div className="relatorios-pesquisa">
        <span>
          ⌕
        </span>

        <input
          type="text"
          name="pesquisaRelatorio"
          placeholder="Número ou nome..."
          value={pesquisa}
          autoComplete="off"
          onChange={(event) =>
            setPesquisa(
              event.target.value
            )
          }
        />
      </div>

      {/* LISTA */}

      <div className="relatorios-lista">

        {relatoriosFiltrados.length >
        0 ? (
          relatoriosFiltrados.map(
            (relatorio) => {
              const selecionado =
                relatorioSelecionado
                  ?.id ===
                relatorio.id

              return (
                <button
                  key={relatorio.id}
                  type="button"
                  className={`relatorio-pasta ${
                    selecionado
                      ? 'ativo'
                      : ''
                  }`}
                  onClick={() =>
                    onSelecionarRelatorio(
                      relatorio
                    )
                  }
                >
                  <div className="relatorio-pasta-icone">
                    📁
                  </div>

                  <div className="relatorio-pasta-conteudo">

                    <span className="relatorio-pasta-numero">
                      {relatorio.id}
                    </span>

                    <strong>
                      {relatorio.nome}
                    </strong>

                    <small>
                      {
                        relatorio.descricaoCurta
                      }
                    </small>

                  </div>
                </button>
              )
            }
          )
        ) : (
          <div className="relatorios-vazio">

            <strong>
              Nenhum relatório encontrado
            </strong>

            <span>
              Tente pesquisar pelo número
              ou pelo nome.
            </span>

          </div>
        )}

      </div>
    </aside>
  )
}

export default MenuRelatorios