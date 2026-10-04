function DetalhesRelatorio({
  relatorioSelecionado,
}) {
  // =========================================
  // NENHUM RELATÓRIO SELECIONADO
  // =========================================

  if (!relatorioSelecionado) {
    return (
      <section className="relatorio-detalhes relatorio-detalhes-vazio">
        <div className="relatorio-vazio-icone">
          📊
        </div>

        <span>
          RELATÓRIOS
        </span>

        <h1>
          Selecione um relatório
        </h1>

        <p>
          Escolha um dos relatórios
          disponíveis na biblioteca ao lado
          para visualizar seus detalhes.
        </p>
      </section>
    )
  }

  // =========================================
  // INFORMAÇÕES DOS RELATÓRIOS
  // =========================================

  const informacoes = {
    '001': {
      titulo:
        'Comparativo semanal de emoções',

      descricao:
        'Apresenta uma comparação das emoções registradas pelo paciente durante os dias de uma semana.',

      objetivo:
        'Facilitar a visualização de como os registros emocionais se distribuem entre os diferentes dias da semana.',

      periodo:
        'Uma semana',

      visualizacao:
        'Comparação diária das emoções',

      filtros:
        'Paciente e semana',
    },

    '002': {
      titulo:
        'Emoções predominantes',

      descricao:
        'Apresenta as emoções registradas com maior frequência pelo paciente durante um período selecionado.',

      objetivo:
        'Permitir uma visão geral da distribuição emocional do paciente e destacar as emoções mais recorrentes.',

      periodo:
        'Período personalizado',

      visualizacao:
        'Distribuição e frequência das emoções',

      filtros:
        'Paciente, data inicial e data final',
    },

    '003': {
      titulo:
        'Emoções por horário do dia',

      descricao:
        'Organiza os registros emocionais do paciente considerando o horário em que cada emoção foi registrada.',

      objetivo:
        'Auxiliar na identificação de padrões emocionais relacionados aos diferentes momentos do dia.',

      periodo:
        'Período personalizado',

      visualizacao:
        'Emoções por dia e horário',

      filtros:
        'Paciente, data inicial e data final',
    },

    '004': {
      titulo:
        'Evolução emocional',

      descricao:
        'Apresenta como os registros emocionais do paciente se modificam ao longo do período selecionado.',

      objetivo:
        'Facilitar a observação de mudanças e tendências nos registros emocionais ao longo do tempo.',

      periodo:
        'Período personalizado',

      visualizacao:
        'Evolução das emoções ao longo do tempo',

      filtros:
        'Paciente, data inicial e data final',
    },

    '005': {
      titulo:
        'Frequência emocional',

      descricao:
        'Apresenta a quantidade e a proporção de cada emoção registrada pelo paciente durante o período selecionado.',

      objetivo:
        'Permitir uma visão quantitativa da distribuição dos registros emocionais do paciente.',

      periodo:
        'Período personalizado',

      visualizacao:
        'Quantidade e percentual por emoção',

      filtros:
        'Paciente, data inicial e data final',
    },

    '006': {
      titulo:
        'Resumo emocional do período',

      descricao:
        'Reúne os principais indicadores dos registros emocionais do paciente em uma única visão.',

      objetivo:
        'Oferecer uma visão geral do período, reunindo informações importantes para consulta e acompanhamento.',

      periodo:
        'Período personalizado',

      visualizacao:
        'Indicadores, distribuição e evolução',

      filtros:
        'Paciente, data inicial e data final',
    },
  }

  const detalhes =
    informacoes[
      relatorioSelecionado.id
    ]

  // =========================================
  // TELA
  // =========================================

  return (
    <section className="relatorio-detalhes">

      {/* =================================
          CABEÇALHO
      ================================= */}

      <div className="relatorio-detalhes-cabecalho">

        <div>
          <span className="relatorio-codigo">
            RELATÓRIO{' '}
            {
              relatorioSelecionado.id
            }
          </span>

          <h1>
            {detalhes?.titulo ||
              relatorioSelecionado.nome}
          </h1>

          <p>
            {detalhes?.descricao ||
              relatorioSelecionado
                .descricaoCurta}
          </p>
        </div>

        <div className="relatorio-detalhes-pasta">
          📁
        </div>

      </div>

      {/* =================================
          OBJETIVO
      ================================= */}

      <div className="relatorio-informacao-bloco">

        <span className="relatorio-informacao-titulo">
          OBJETIVO
        </span>

        <p>
          {detalhes?.objetivo}
        </p>

      </div>

      {/* =================================
          INFORMAÇÕES
      ================================= */}

      <div className="relatorio-informacoes-grid">

        <div className="relatorio-informacao-card">
          <span>
            PERÍODO
          </span>

          <strong>
            {detalhes?.periodo}
          </strong>
        </div>

        <div className="relatorio-informacao-card">
          <span>
            VISUALIZAÇÃO
          </span>

          <strong>
            {detalhes?.visualizacao}
          </strong>
        </div>

        <div className="relatorio-informacao-card">
          <span>
            FILTROS
          </span>

          <strong>
            {detalhes?.filtros}
          </strong>
        </div>

      </div>

      {/* =================================
          PRÓXIMO PASSO
      ================================= */}

      <div className="relatorio-proximo-passo">

        <div className="relatorio-proximo-icone">
          👤
        </div>

        <div>
          <span>
            PRÓXIMO PASSO
          </span>

          <h3>
            Selecione um paciente
          </h3>

          <p>
            Após selecionar o paciente,
            os dados do relatório serão
            apresentados nesta área.
          </p>
        </div>

      </div>

      {/* =================================
          RECURSOS
      ================================= */}

      <div className="relatorio-recursos">

        <span>
          RECURSOS DO RELATÓRIO
        </span>

        <div className="relatorio-recursos-lista">

          <div>
            <strong>
              📅 Alterar período
            </strong>

            <small>
              Consulte diferentes datas
              sem sair do relatório.
            </small>
          </div>

          <div>
            <strong>
              🖨 Imprimir
            </strong>

            <small>
              Versão preparada para
              impressão.
            </small>
          </div>

          <div>
            <strong>
              📄 PDF
            </strong>

            <small>
              Salve uma versão do
              relatório em PDF.
            </small>
          </div>

          <div>
            <strong>
              ✎ Anotações
            </strong>

            <small>
              Registre observações
              relacionadas ao paciente.
            </small>
          </div>

          <div>
            <strong>
              ✨ Análise assistida
            </strong>

            <small>
              Recurso preparado para
              futura integração com IA.
            </small>
          </div>

        </div>
      </div>

    </section>
  )
}

export default DetalhesRelatorio