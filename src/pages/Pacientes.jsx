import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  buscarPacientesSupabase,
} from '../services/pacienteService'
import {
  buscarEmocoesPorPaciente,
} from '../services/emocaoService'
import BlocoNotas
  from '../components/notas/BlocoNotas'
function Pacientes() {
  const navigate = useNavigate()
  // ========================================
  // ID RECEBIDO PELA URL
  // Exemplo:
  // /pacientes/01d17d40-...
  // ========================================
  const { pacienteId } = useParams()
  // ========================================
  // ESTADOS
  // ========================================
  const [pacientes, setPacientes] =
    useState([])
  const [
    pacienteSelecionado,
    setPacienteSelecionado,
  ] = useState(null)
  const [pesquisa, setPesquisa] =
    useState('')
  const [emocoes, setEmocoes] =
    useState([])
  const [
    carregandoPacientes,
    setCarregandoPacientes,
  ] = useState(true)
  const [
    carregandoEmocoes,
    setCarregandoEmocoes,
  ] = useState(false)
  const [erro, setErro] =
    useState('')
  const [mostrarHistoricoCompleto, setMostrarHistoricoCompleto] = useState(false)
  // ========================================
  // CARREGAR PACIENTES DO SUPABASE
  // ========================================
  useEffect(() => {
    async function carregarPacientes() {
      try {
        setCarregandoPacientes(true)
        setErro('')
        const dados =
          await buscarPacientesSupabase()
        setPacientes(dados)
        // ===================================
        // VEIO UM PACIENTE PELO DASHBOARD
        // ===================================
        if (pacienteId) {
          const pacienteDaUrl =
            dados.find(
              (paciente) =>
                paciente.id === pacienteId
            )
          if (pacienteDaUrl) {
            setPacienteSelecionado(
              pacienteDaUrl
            )
          } else {
            setPacienteSelecionado(null)
            setErro(
              'O paciente informado não foi encontrado.'
            )
          }
        }
      } catch (error) {
        console.error(error)
        setErro(
          'Não foi possível carregar os pacientes.'
        )
      } finally {
        setCarregandoPacientes(false)
      }
    }
    carregarPacientes()
  }, [pacienteId])
  // ========================================
  // CARREGAR EMOÇÕES DO PACIENTE
  // ========================================
  useEffect(() => {
    async function carregarEmocoes() {
      if (!pacienteSelecionado) {
        setEmocoes([])
        return
      }
      try {
        setCarregandoEmocoes(true)
        setErro('')
        const dados =
          await buscarEmocoesPorPaciente(
            pacienteSelecionado.id
          )
        setEmocoes(dados)
      } catch (error) {
        console.error(error)
        setErro(
          'Não foi possível carregar as emoções deste paciente.'
        )
      } finally {
        setCarregandoEmocoes(false)
      }
    }
    carregarEmocoes()
  }, [pacienteSelecionado])
  // ========================================
  // PESQUISA
  // ========================================
  const pacientesFiltrados =
    pacientes.filter((paciente) =>
      paciente.nome
        ?.toLowerCase()
        .includes(
          pesquisa
            .trim()
            .toLowerCase()
        )
    )
  // ========================================
  // RESUMO DAS EMOÇÕES
  // ========================================
  const resumoEmocoes = useMemo(() => {
    const resumo = {}
    emocoes.forEach((registro) => {
      const emocao =
        registro.Selection_Type
      if (!emocao) {
        return
      }
      resumo[emocao] =
        (resumo[emocao] || 0) + 1
    })
    return Object.entries(resumo)
      .map(
        ([emocao, quantidade]) => ({
          emocao,
          quantidade,
        })
      )
      .sort(
        (a, b) =>
          b.quantidade -
          a.quantidade
      )
  }, [emocoes])
  // ========================================
  // EMOÇÃO MAIS RECENTE
  // ========================================
  const emocaoMaisRecente =
    emocoes.length > 0
      ? emocoes[0]
      : null
  // ========================================
  // FORMATAR DATA/HORA
  // ========================================
  function formatarDataHora(dataHora) {
    if (!dataHora) {
      return '-'
    }
    const data =
      new Date(dataHora)
    return data.toLocaleString(
      'pt-BR',
      {
        dateStyle: 'short',
        timeStyle: 'short',
      }
    )
  }
  // ========================================
  // SELECIONAR PACIENTE MANUALMENTE
  // ========================================
  function selecionarPaciente(
    paciente
  ) {
    setPacienteSelecionado(
      paciente
    )
    setErro('')
    setMostrarHistoricoCompleto(false)
  }
  return (
    <main className="pagina-pacientes">
      {/* =====================================
          CABEÇALHO
      ===================================== */}
      <header className="dashboard-header">
        <div className="dashboard-marca">
          SENSUS-MAP
        </div>
        <nav className="dashboard-nav">
          {/* INÍCIO SEM BARRINHA */}
          <Link to="/dashboard">
            Início
          </Link>
          {/* PACIENTES COM BARRINHA */}
          <Link
            to="/pacientes"
            className="nav-ativo"
          >
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
          <span>
            Psicólogo
          </span>
          <button
            type="button"
            className="botao-perfil"
            onClick={() => navigate('/perfil')}
          >
            Perfil
          </button>
        </div>
      </header>
      {/* =====================================
          CONTEÚDO
      ===================================== */}
      <section className="pacientes-conteudo">
        {/* ===================================
            LISTA DE PACIENTES
        =================================== */}
        <aside className="pacientes-lateral">
          <div className="pacientes-lateral-titulo">
            <span>
              PACIENTES
            </span>
            <h1>
              Meus pacientes
            </h1>
          </div>
          {/* PESQUISA */}
          <input
            className="pacientes-pesquisa"
            type="text"
            placeholder="Pesquisar paciente..."
            value={pesquisa}
            onChange={(event) =>
              setPesquisa(
                event.target.value
              )
            }
          />
          {/* LISTA */}
          <div className="pacientes-lista">
            {carregandoPacientes && (
              <p className="pacientes-mensagem">
                Carregando pacientes...
              </p>
            )}
            {!carregandoPacientes &&
              pacientesFiltrados.map(
                (paciente) => (
                  <button
                    type="button"
                    key={paciente.id}
                    className={
                      pacienteSelecionado?.id ===
                      paciente.id
                        ? 'pacientes-item pacientes-item-ativo'
                        : 'pacientes-item'
                    }
                    onClick={() =>
                      selecionarPaciente(
                        paciente
                      )
                    }
                  >
                    {/* AVATAR */}
                    <div className="pacientes-avatar">
                      {paciente.nome
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>
                    {/* NOME */}
                    <div>
                      <strong>
                        {paciente.nome}
                      </strong>
                      <span>
                        Ver informações
                      </span>
                    </div>
                  </button>
                )
              )}
            {!carregandoPacientes &&
              pacientesFiltrados.length ===
                0 && (
                <p className="pacientes-mensagem">
                  Nenhum paciente encontrado.
                </p>
              )}
          </div>
        </aside>
        {/* ===================================
            ÁREA DO PACIENTE
        =================================== */}
        <section className="paciente-detalhes">
          {!pacienteSelecionado ? (
            /* =================================
               SEM PACIENTE SELECIONADO
            ================================= */
            <div className="paciente-sem-selecao">
              <div className="paciente-sem-selecao-icone">
                +
              </div>
              <span>
                ÁREA DO PACIENTE
              </span>
              <h2>
                Selecione um paciente
              </h2>
              <p>
                Escolha um paciente na
                lista para visualizar seus
                dados e registros
                emocionais.
              </p>
            </div>
          ) : (
            <>
              {/* ===============================
                  IDENTIFICAÇÃO
              =============================== */}
              <div className="paciente-detalhes-cabecalho">
                <div className="paciente-detalhes-avatar">
                  {pacienteSelecionado.nome
                    ?.charAt(0)
                    .toUpperCase()}
                </div>
                <div>
                  <span>
                    PACIENTE
                  </span>
                  <h1>
                    {
                      pacienteSelecionado.nome
                    }
                  </h1>
                  <p>
                    {pacienteSelecionado.estado ||
                      'Estado não informado'}
                    {pacienteSelecionado.pais
                      ? ` • ${pacienteSelecionado.pais}`
                      : ''}
                  </p>
                </div>
              </div>
              {/* ===============================
                  INFORMAÇÕES GERAIS
              =============================== */}
              <section className="paciente-informacoes">
                <div className="paciente-secao-titulo">
                  <span>
                    DADOS DO PACIENTE
                  </span>
                  <h2>
                    Informações gerais
                  </h2>
                </div>
                <div className="paciente-informacoes-grid">
                  <div className="paciente-informacao">
                    <span>
                      Nome
                    </span>
                    <strong>
                      {pacienteSelecionado.nome ||
                        'Não informado'}
                    </strong>
                  </div>
                  <div className="paciente-informacao">
                    <span>
                      Status
                    </span>
                    <strong>
                      {pacienteSelecionado.status ===
                      'active'
                        ? 'Ativo'
                        : pacienteSelecionado.status ||
                          'Não informado'}
                    </strong>
                  </div>
                  <div className="paciente-informacao">
                    <span>
                      País
                    </span>
                    <strong>
                      {pacienteSelecionado.pais ||
                        'Não informado'}
                    </strong>
                  </div>
                  <div className="paciente-informacao">
                    <span>
                      Estado
                    </span>
                    <strong>
                      {pacienteSelecionado.estado ||
                        'Não informado'}
                    </strong>
                  </div>
                  <div className="paciente-informacao">
                    <span>
                      Cidade
                    </span>
                    <strong>
                      {pacienteSelecionado.cidade ||
                        'Não informado'}
                    </strong>
                  </div>
                </div>
              </section>
              {/* ===============================
                  RESUMO
              =============================== */}
              <div className="paciente-resumo-grid">
                <article className="paciente-resumo-card">
                  <span>
                    REGISTROS
                  </span>
                  <strong>
                    {emocoes.length}
                  </strong>
                  <p>
                    emoções registradas
                  </p>
                </article>
                <article className="paciente-resumo-card">
                  <span>
                    MAIS RECENTE
                  </span>
                  <strong>
                    {emocaoMaisRecente
                      ?.Selection_Type ||
                      '-'}
                  </strong>
                  <p>
                    {emocaoMaisRecente
                      ? formatarDataHora(
                          emocaoMaisRecente
                            .Date_Time_Selection
                        )
                      : 'Sem registros'}
                  </p>
                </article>
              </div>
              {/* ===============================
                  ANOTAÇÕES
              =============================== */}
              <BlocoNotas
                paciente={pacienteSelecionado}
                limiteInicial={3}
                modoResumo={true}
              />
              {/* ===============================
                  EMOÇÕES
              =============================== */}
              <section className="paciente-emocoes">
                <div className="paciente-secao-titulo">
                  <span>
                    EMOÇÕES
                  </span>
                  <h2>
                    Relatório emocional
                  </h2>
                  <p>
                    Registros enviados pelo
                    paciente através do
                    SENSUS.
                  </p>
                </div>
                {carregandoEmocoes ? (
                  <p className="pacientes-mensagem">
                    Carregando emoções...
                  </p>
                ) : (
                  <>
                    {/* =========================
                        RESUMO DAS EMOÇÕES
                    ========================= */}
                    <div className="emocoes-resumo">
                      {resumoEmocoes.map(
                        (item) => (
                          <div
                            className="emocao-resumo-item"
                            key={
                              item.emocao
                            }
                          >
                            <strong>
                              {item.emocao}
                            </strong>
                            <span>
                              {item.quantidade}{' '}
                              {item.quantidade ===
                              1
                                ? 'registro'
                                : 'registros'}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                    {/* =========================
                        HISTÓRICO
                    ========================= */}
                    <div className="emocao-historico">
                      <h3>
                        Histórico recente
                      </h3>
                      {emocoes.length ===
                      0 ? (
                        <p className="pacientes-mensagem">
                          Este paciente ainda
                          não possui registros
                          emocionais.
                        </p>
                      ) : (
                        (mostrarHistoricoCompleto ? emocoes : emocoes.slice(0, 5)).map(
                          (registro) => (
                            <div
                              className="emocao-historico-item"
                              key={
                                registro.ID_Map
                              }
                            >
                              <div className="emocao-historico-marcador" />
                              <div>
                                <strong>
                                  {
                                    registro.Selection_Type
                                  }
                                </strong>
                                <span>
                                  {formatarDataHora(
                                    registro
                                      .Date_Time_Selection
                                  )}
                                </span>
                              </div>
                            </div>
                          )
                        )
                      )}
                      {emocoes.length > 5 && (
                        <div className="emocao-historico-expandir">
                          <button
                            type="button"
                            onClick={() =>
                              setMostrarHistoricoCompleto((valor) => !valor)
                            }
                          >
                            {mostrarHistoricoCompleto
                              ? 'Mostrar menos ↑'
                              : `Ver histórico completo (${emocoes.length}) ↓`}
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </section>
            </>
          )}
          {/* =================================
              ERRO
          ================================= */}
          {erro && (
            <div className="pacientes-erro">
              {erro}
            </div>
          )}
        </section>
      </section>
    </main>
  )
}
export default Pacientes
