import {
  useEffect,
  useState,
} from 'react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

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

function Dashboard() {
  const navigate = useNavigate()

  // =========================================
  // ESTADOS
  // =========================================

  const [modalAberto, setModalAberto] =
    useState(false)

  const [pesquisa, setPesquisa] =
    useState('')

  const [
    pacienteSelecionado,
    setPacienteSelecionado,
  ] = useState(null)

  const [pacientes, setPacientes] =
    useState([])

  const [agendamentos, setAgendamentos] =
    useState([])

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

  const [
    erroPacientes,
    setErroPacientes,
  ] = useState('')

  const [
    erroEmocoes,
    setErroEmocoes,
  ] = useState('')

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

  // Enviamos o ID do paciente na URL.
  function abrirDadosPaciente() {
    if (!pacienteSelecionado) {
      return
    }

    navigate(
      `/pacientes/${pacienteSelecionado.id}`
    )
  }

  /*
    A tela de relatórios ainda será criada.

    Por enquanto não vamos navegar para
    uma rota inexistente.
  */
  function abrirRelatoriosPaciente() {
    if (!pacienteSelecionado) {
      return
    }

    console.log(
      'Relatório futuro do paciente:',
      pacienteSelecionado.id
    )
  }

  return (
    <main className="pagina-dashboard">

      {/* =====================================
          CABEÇALHO
      ===================================== */}

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

          <a href="#">
            Relatórios
          </a>

        </nav>

        <div className="dashboard-usuario">

          <span>
            Psicólogo
          </span>

          <button
            type="button"
            className="botao-perfil"
          >
            Perfil
          </button>

        </div>

      </header>

      {/* =====================================
          CONTEÚDO
      ===================================== */}

      <section className="dashboard-conteudo">

        {/* ===================================
            PAINEL PRINCIPAL
        =================================== */}

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

        </section>

        {/* ===================================
            AGENDA
        =================================== */}

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

      {/* =====================================
          MENU FLUTUANTE
      ===================================== */}

      <div className="atalhos-dashboard">

        <button
          type="button"
          className="atalho-item"
          onClick={
            abrirAgenda
          }
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
        >

          <span className="atalho-icone">
            ?
          </span>

          <span className="atalho-texto">
            Ajuda
          </span>

        </button>

        <button
          type="button"
          className="atalho-item"
        >

          <span className="atalho-icone">
            ⚙
          </span>

          <span className="atalho-texto">
            Configurações
          </span>

        </button>

      </div>

      {/* =====================================
          MODAL DE PACIENTES
      ===================================== */}

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