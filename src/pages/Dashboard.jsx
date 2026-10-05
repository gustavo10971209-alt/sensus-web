import {
  useEffect,
  useState,
} from 'react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

import {
  buscarPsicologoLogado,
} from '../services/authService'

import {
  buscarPacientesSupabase,
} from '../services/pacienteService'

import {
  buscarEmocoesPorPaciente,
} from '../services/emocaoService'

import {
  buscarAgendamentos,
} from '../services/agendaService'

import PainelPaciente
  from '../components/dashboard/PainelPaciente'

import ProximosAgendamentos
  from '../components/dashboard/ProximosAgendamentos'

import ModalSelecionarPaciente
  from '../components/dashboard/ModalSelecionarPaciente'

import BlocoNotas
  from '../components/notas/BlocoNotas'

function Dashboard() {
  const navigate = useNavigate()

  // =========================================
  // ESTADOS
  // =========================================

  const [
    modalAberto,
    setModalAberto,
  ] = useState(false)

  const [
    pesquisa,
    setPesquisa,
  ] = useState('')

  const [
    pacienteSelecionado,
    setPacienteSelecionado,
  ] = useState(null)

  const [
    pacientes,
    setPacientes,
  ] = useState([])

  const [
    agendamentos,
    setAgendamentos,
  ] = useState([])

  const [
    emocoes,
    setEmocoes,
  ] = useState([])

  const [
    psicologo,
    setPsicologo,
  ] = useState(null)

  const [
    carregandoPacientes,
    setCarregandoPacientes,
  ] = useState(true)

  const [
    carregandoEmocoes,
    setCarregandoEmocoes,
  ] = useState(false)

  const [
    erroPacientes,
    setErroPacientes,
  ] = useState('')

  const [
    erroEmocoes,
    setErroEmocoes,
  ] = useState('')

  // =========================================
  // CARREGAR PSICÓLOGO
  // =========================================

  useEffect(() => {
    async function carregarPsicologo() {
      try {
        const dados =
          await buscarPsicologoLogado()

        setPsicologo(dados)
      } catch (error) {
        console.error(
          'Erro ao carregar psicólogo:',
          error
        )
      }
    }

    carregarPsicologo()
  }, [])

  // =========================================
  // CARREGAR PACIENTES E AGENDAMENTOS
  // =========================================

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregandoPacientes(true)
        setErroPacientes('')

        const [
          pacientesBanco,
          agendamentosRecebidos,
        ] = await Promise.all([
          buscarPacientesSupabase(),
          buscarAgendamentos(),
        ])

        setPacientes(
          pacientesBanco
        )

        setAgendamentos(
          agendamentosRecebidos
        )
      } catch (error) {
        console.error(
          'Erro ao carregar Dashboard:',
          error
        )

        setErroPacientes(
          'Não foi possível carregar os pacientes.'
        )
      } finally {
        setCarregandoPacientes(false)
      }
    }

    carregarDados()
  }, [])

  // =========================================
  // CARREGAR EMOÇÕES
  // =========================================

  useEffect(() => {
    async function carregarEmocoes() {
      if (!pacienteSelecionado) {
        setEmocoes([])
        setErroEmocoes('')
        return
      }

      try {
        setCarregandoEmocoes(true)
        setErroEmocoes('')

        const dados =
          await buscarEmocoesPorPaciente(
            pacienteSelecionado.id
          )

        setEmocoes(dados)
      } catch (error) {
        console.error(
          'Erro ao carregar emoções:',
          error
        )

        setEmocoes([])

        setErroEmocoes(
          'Não foi possível carregar as emoções deste paciente.'
        )
      } finally {
        setCarregandoEmocoes(false)
      }
    }

    carregarEmocoes()
  }, [pacienteSelecionado])

  // =========================================
  // MODAL
  // =========================================

  function abrirModalPacientes() {
    setModalAberto(true)
  }

  function fecharModalPacientes() {
    setModalAberto(false)
    setPesquisa('')
  }

  function selecionarPaciente(
    paciente
  ) {
    setPacienteSelecionado(
      paciente
    )

    setModalAberto(false)
    setPesquisa('')
  }

  // =========================================
  // NAVEGAÇÃO
  // =========================================

  function abrirAgenda() {
    navigate('/agendamentos')
  }

  function abrirPerfil() {
    navigate('/perfil')
  }

  function abrirAjuda() {
    navigate('/ajuda')
  }

  function abrirDadosPaciente() {
    if (!pacienteSelecionado) {
      return
    }

    navigate(
      `/pacientes/${pacienteSelecionado.id}`
    )
  }

  function abrirRelatoriosPaciente() {
    if (!pacienteSelecionado) {
      return
    }

    navigate(
      `/relatorios?paciente=${pacienteSelecionado.id}`
    )
  }

  // =========================================
  // TELA
  // =========================================

  return (
    <main className="pagina-dashboard">

      {/* CABEÇALHO */}

      <header className="dashboard-header">

        <div className="dashboard-marca">
          SENSUS-MAP
        </div>

        <nav className="dashboard-nav">

          <Link
            to="/dashboard"
            className="nav-ativo"
          >
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

          <span>
            {psicologo?.Name ||
              'Psicólogo'}
          </span>

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

      <section className="dashboard-conteudo">

        {/* PAINEL PRINCIPAL */}

        <section className="dashboard-principal">

          <div className="titulo-dashboard">

            <span>
              PAINEL
            </span>

            <h1>
              Bem-vindo ao SENSUS-MAP
            </h1>

            <p>
              Acompanhe seus pacientes e
              tenha acesso rápido às
              principais informações.
            </p>

          </div>

          <PainelPaciente
            pacienteSelecionado={
              pacienteSelecionado
            }
            emocoes={emocoes}
            carregandoEmocoes={
              carregandoEmocoes
            }
            erroEmocoes={
              erroEmocoes
            }
            onSelecionarPaciente={
              abrirModalPacientes
            }
            onTrocarPaciente={
              abrirModalPacientes
            }
            onVerDados={
              abrirDadosPaciente
            }
            onVerRelatorios={
              abrirRelatoriosPaciente
            }
          />

          {/* BLOCO DE NOTAS DO PACIENTE */}

          {pacienteSelecionado && (
            <BlocoNotas
              paciente={
                pacienteSelecionado
              }
              limiteInicial={3}
            />
          )}

        </section>

        {/* AGENDA */}

        <ProximosAgendamentos
          agendamentos={
            agendamentos
          }
          pacientes={
            pacientes
          }
          onAbrirAgenda={
            abrirAgenda
          }
        />

      </section>

      {/* MENU FLUTUANTE */}

      <div className="atalhos-dashboard">

        <button
          type="button"
          className="atalho-item"
          onClick={abrirAgenda}
        >

          <span className="atalho-icone">
            +
          </span>

          <span className="atalho-texto">
            Novo agendamento
          </span>

        </button>

        <button
          type="button"
          className="atalho-item"
          onClick={abrirAjuda}
        >

          <span className="atalho-icone">
            ?
          </span>

          <span className="atalho-texto">
            Ajuda
          </span>

        </button>

      </div>

      {/* MODAL DE PACIENTES */}

      <ModalSelecionarPaciente
        aberto={
          modalAberto
        }
        pesquisa={
          pesquisa
        }
        setPesquisa={
          setPesquisa
        }
        pacientes={
          pacientes
        }
        carregando={
          carregandoPacientes
        }
        erro={
          erroPacientes
        }
        onFechar={
          fecharModalPacientes
        }
        onSelecionar={
          selecionarPaciente
        }
      />

    </main>
  )
}

export default Dashboard