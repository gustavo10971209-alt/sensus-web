import {
  useEffect,
  useState,
} from 'react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

import {
  atualizarPsicologoLogado,
  buscarPsicologoLogado,
  logoutPsicologo,
} from '../services/authService'

import {
  supabase,
} from '../services/supabase'

const FORMULARIO_VAZIO = {
  nome: '',
  dataNascimento: '',
  cidade: '',
  estado: '',
  pais: '',
  telefone: '',
  email: '',
  crp: '',
}

function transformarPerfilEmFormulario(
  dados
) {
  return {
    nome:
      dados?.Name || '',

    dataNascimento:
      dados?.Birth_Date || '',

    cidade:
      dados?.City || '',

    estado:
      dados?.State || '',

    pais:
      dados?.Country || '',

    telefone:
      dados?.Phone || '',

    email:
      dados?.Email || '',

    crp:
      dados?.CRP || '',
  }
}

function Perfil() {
  const navigate =
    useNavigate()

  const [
    psicologo,
    setPsicologo,
  ] = useState(null)

  const [
    formulario,
    setFormulario,
  ] = useState(
    FORMULARIO_VAZIO
  )

  const [
    editando,
    setEditando,
  ] = useState(false)

  const [
    carregando,
    setCarregando,
  ] = useState(true)

  const [
    salvando,
    setSalvando,
  ] = useState(false)

  const [
    mensagem,
    setMensagem,
  ] = useState('')

  const [
    erro,
    setErro,
  ] = useState('')

  // =======================================================
  // SENHA
  // =======================================================

  const [
    alterandoSenha,
    setAlterandoSenha,
  ] = useState(false)

  const [
    novaSenha,
    setNovaSenha,
  ] = useState('')

  const [
    confirmarSenha,
    setConfirmarSenha,
  ] = useState('')

  const [
    salvandoSenha,
    setSalvandoSenha,
  ] = useState(false)

  const [
    erroSenha,
    setErroSenha,
  ] = useState('')

  const [
    mensagemSenha,
    setMensagemSenha,
  ] = useState('')

  // =======================================================
  // CARREGAR PERFIL
  // =======================================================

  useEffect(() => {
    async function carregarPerfil() {
      try {
        setCarregando(true)
        setErro('')

        const dados =
          await buscarPsicologoLogado()

        if (!dados) {
          navigate(
            '/login',
            {
              replace: true,
            }
          )

          return
        }

        setPsicologo(
          dados
        )

        setFormulario(
          transformarPerfilEmFormulario(
            dados
          )
        )
      } catch (error) {
        console.error(
          'Erro ao carregar perfil:',
          error
        )

        setErro(
          'Não foi possível carregar seu perfil.'
        )
      } finally {
        setCarregando(false)
      }
    }

    carregarPerfil()
  }, [navigate])

  // =======================================================
  // FORMULÁRIO
  // =======================================================

  function alterarCampo(
    campo,
    valor
  ) {
    setFormulario(
      (atual) => ({
        ...atual,
        [campo]: valor,
      })
    )
  }

  function iniciarEdicao() {
    setMensagem('')
    setErro('')
    setEditando(true)
  }

  function cancelarEdicao() {
    setFormulario(
      transformarPerfilEmFormulario(
        psicologo
      )
    )

    setErro('')
    setMensagem('')
    setEditando(false)
  }

  // =======================================================
  // SALVAR PERFIL
  // =======================================================

  async function salvarPerfil(
    event
  ) {
    event.preventDefault()

    const {
      nome,
      dataNascimento,
      cidade,
      estado,
      pais,
      telefone,
      email,
      crp,
    } = formulario

    if (
      !nome.trim() ||
      !dataNascimento ||
      !cidade.trim() ||
      !estado.trim() ||
      !pais.trim() ||
      !telefone.trim() ||
      !email.trim() ||
      !crp.trim()
    ) {
      setErro(
        'Preencha todos os dados do perfil.'
      )

      return
    }

    try {
      setSalvando(true)
      setErro('')
      setMensagem('')

      const atualizado =
        await atualizarPsicologoLogado({
          nome,
          dataNascimento,
          cidade,
          estado,
          pais,
          telefone,
          email,
          crp,
        })

      setPsicologo(
        atualizado
      )

      setFormulario(
        transformarPerfilEmFormulario(
          atualizado
        )
      )

      setEditando(false)

      if (
        atualizado
          .EmailChangeRequested
      ) {
        setMensagem(
          'Dados salvos. Se o Supabase solicitar confirmação do novo e-mail, confirme pelo link enviado.'
        )
      } else {
        setMensagem(
          'Perfil atualizado com sucesso.'
        )
      }
    } catch (error) {
      console.error(
        'Erro ao salvar perfil:',
        error
      )

      setErro(
        error.message ||
          'Não foi possível salvar o perfil.'
      )
    } finally {
      setSalvando(false)
    }
  }

  // =======================================================
  // SENHA
  // =======================================================

  function abrirAlteracaoSenha() {
    setNovaSenha('')
    setConfirmarSenha('')
    setErroSenha('')
    setMensagemSenha('')
    setAlterandoSenha(true)
  }

  function cancelarAlteracaoSenha() {
    setNovaSenha('')
    setConfirmarSenha('')
    setErroSenha('')
    setMensagemSenha('')
    setAlterandoSenha(false)
  }

  async function alterarSenha(
    event
  ) {
    event.preventDefault()

    setErroSenha('')
    setMensagemSenha('')

    if (
      novaSenha.length < 6
    ) {
      setErroSenha(
        'A senha deve possuir pelo menos 6 caracteres.'
      )

      return
    }

    if (
      novaSenha !==
      confirmarSenha
    ) {
      setErroSenha(
        'As senhas não são iguais.'
      )

      return
    }

    try {
      setSalvandoSenha(true)

      const {
        error,
      } =
        await supabase.auth.updateUser({
          password:
            novaSenha,
        })

      if (error) {
        throw error
      }

      setNovaSenha('')
      setConfirmarSenha('')
      setAlterandoSenha(false)

      setMensagemSenha(
        'Senha alterada com sucesso.'
      )
    } catch (error) {
      console.error(
        'Erro ao alterar senha:',
        error
      )

      setErroSenha(
        'Não foi possível alterar a senha.'
      )
    } finally {
      setSalvandoSenha(false)
    }
  }

  // =======================================================
  // SAIR
  // =======================================================

  async function sair() {
    try {
      await logoutPsicologo()
    } catch (error) {
      console.error(
        'Erro ao sair:',
        error
      )
    } finally {
      navigate(
        '/login',
        {
          replace: true,
        }
      )
    }
  }

  // =======================================================
  // CARREGAMENTO
  // =======================================================

  if (carregando) {
    return (
      <main className="perfil-carregando">
        <p>
          Carregando perfil...
        </p>
      </main>
    )
  }

  // =======================================================
  // TELA
  // =======================================================

  return (
    <main className="pagina-dashboard">

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

          <span>
            {psicologo?.Name ||
              'Psicólogo'}
          </span>

          <button
            type="button"
            className="botao-perfil"
            onClick={sair}
          >
            Sair
          </button>

        </div>

      </header>

      <section className="dashboard-conteudo">

        <section className="dashboard-principal perfil-pagina">

          <div className="titulo-dashboard">

            <span>
              PERFIL
            </span>

            <h1>
              Meu perfil
            </h1>

            <p>
              Consulte seus dados
              profissionais e altere-os
              quando necessário.
            </p>

          </div>

          {/* DADOS DO PERFIL */}

          <form
            onSubmit={
              salvarPerfil
            }
            className="perfil-formulario"
          >

            <div className="perfil-grid">

              <div className="campo">

                <label htmlFor="perfil-nome">
                  Nome
                </label>

                <input
                  id="perfil-nome"
                  type="text"
                  value={
                    formulario.nome
                  }
                  onChange={(event) =>
                    alterarCampo(
                      'nome',
                      event.target.value
                    )
                  }
                  disabled={!editando}
                  required
                />

              </div>

              <div className="campo">

                <label htmlFor="perfil-nascimento">
                  Data de nascimento
                </label>

                <input
                  id="perfil-nascimento"
                  type="date"
                  value={
                    formulario
                      .dataNascimento
                  }
                  onChange={(event) =>
                    alterarCampo(
                      'dataNascimento',
                      event.target.value
                    )
                  }
                  disabled={!editando}
                  required
                />

              </div>

              <div className="campo">

  <label htmlFor="perfil-email">
    E-mail
  </label>

  <input
    id="perfil-email"
    type="email"
    value={
      formulario.email
    }
    disabled
  />

</div>

              <div className="campo">

                <label htmlFor="perfil-telefone">
                  Número de celular
                </label>

                <input
                  id="perfil-telefone"
                  type="tel"
                  value={
                    formulario.telefone
                  }
                  onChange={(event) =>
                    alterarCampo(
                      'telefone',
                      event.target.value
                    )
                  }
                  placeholder={
                    editando
                      ? '(00) 00000-0000'
                      : 'Não informado'
                  }
                  maxLength={20}
                  disabled={!editando}
                  required
                />

              </div>

              <div className="campo">

                <label htmlFor="perfil-crp">
                  CRP
                </label>

                <input
                  id="perfil-crp"
                  type="text"
                  value={
                    formulario.crp
                  }
                  onChange={(event) =>
                    alterarCampo(
                      'crp',
                      event.target.value
                    )
                  }
                  placeholder={
                    editando
                      ? 'Ex.: 20/12345'
                      : 'Não informado'
                  }
                  maxLength={30}
                  disabled={!editando}
                  required
                />

              </div>

              <div className="campo">

                <label htmlFor="perfil-cidade">
                  Cidade
                </label>

                <input
                  id="perfil-cidade"
                  type="text"
                  value={
                    formulario.cidade
                  }
                  onChange={(event) =>
                    alterarCampo(
                      'cidade',
                      event.target.value
                    )
                  }
                  placeholder="Cidade"
                  disabled={!editando}
                  required
                />

              </div>

              <div className="campo">

                <label htmlFor="perfil-estado">
                  Estado
                </label>

                <input
                  id="perfil-estado"
                  type="text"
                  value={
                    formulario.estado
                  }
                  onChange={(event) =>
                    alterarCampo(
                      'estado',
                      event.target.value
                    )
                  }
                  placeholder="Estado"
                  disabled={!editando}
                  required
                />

              </div>

              <div className="campo">

                <label htmlFor="perfil-pais">
                  País
                </label>

                <input
                  id="perfil-pais"
                  type="text"
                  value={
                    formulario.pais
                  }
                  onChange={(event) =>
                    alterarCampo(
                      'pais',
                      event.target.value
                    )
                  }
                  placeholder="País"
                  disabled={!editando}
                  required
                />

              </div>

            </div>

            {erro && (
              <div
                className="login-erro perfil-mensagem"
                role="alert"
              >
                {erro}
              </div>
            )}

            {mensagem && (
              <div className="perfil-sucesso">
                ✓ {mensagem}
              </div>
            )}

            <div className="perfil-acoes">

              {!editando ? (
                <button
                  type="button"
                  className="botao-entrar perfil-botao-principal"
                  onClick={
                    iniciarEdicao
                  }
                >
                  Editar perfil
                </button>
              ) : (
                <>

                  <button
                    type="button"
                    className="perfil-botao-cancelar"
                    onClick={
                      cancelarEdicao
                    }
                    disabled={
                      salvando
                    }
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="botao-entrar perfil-botao-principal"
                    disabled={
                      salvando
                    }
                  >
                    {salvando
                      ? 'Salvando...'
                      : 'Salvar alterações'}
                  </button>

                </>
              )}

            </div>

          </form>

          {/* SEGURANÇA */}

          <section className="perfil-seguranca">

            <div className="perfil-seguranca-cabecalho">

              <div>

                <span className="perfil-seguranca-etiqueta">
                  SEGURANÇA
                </span>

                <h2>
                  Segurança da conta
                </h2>

                <p>
                  Altere sua senha de acesso
                  ao SENSUS-MAP.
                </p>

              </div>

              {!alterandoSenha && (
                <button
                  type="button"
                  className="perfil-botao-senha"
                  onClick={
                    abrirAlteracaoSenha
                  }
                >
                  Alterar senha
                </button>
              )}

            </div>

            {mensagemSenha && (
              <div className="perfil-sucesso">
                ✓ {mensagemSenha}
              </div>
            )}

            {alterandoSenha && (
              <form
                onSubmit={
                  alterarSenha
                }
                className="perfil-formulario-senha"
              >

                <div className="perfil-grid">

                  <div className="campo">

                    <label htmlFor="nova-senha">
                      Nova senha
                    </label>

                    <input
                      id="nova-senha"
                      type="password"
                      value={
                        novaSenha
                      }
                      onChange={(event) =>
                        setNovaSenha(
                          event.target.value
                        )
                      }
                      placeholder="Digite a nova senha"
                      autoComplete="new-password"
                      required
                    />

                  </div>

                  <div className="campo">

                    <label htmlFor="confirmar-senha">
                      Confirmar nova senha
                    </label>

                    <input
                      id="confirmar-senha"
                      type="password"
                      value={
                        confirmarSenha
                      }
                      onChange={(event) =>
                        setConfirmarSenha(
                          event.target.value
                        )
                      }
                      placeholder="Digite novamente"
                      autoComplete="new-password"
                      required
                    />

                  </div>

                </div>

                {erroSenha && (
                  <div
                    className="login-erro perfil-mensagem"
                    role="alert"
                  >
                    {erroSenha}
                  </div>
                )}

                <div className="perfil-acoes">

                  <button
                    type="button"
                    className="perfil-botao-cancelar"
                    onClick={
                      cancelarAlteracaoSenha
                    }
                    disabled={
                      salvandoSenha
                    }
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="botao-entrar perfil-botao-principal"
                    disabled={
                      salvandoSenha
                    }
                  >
                    {salvandoSenha
                      ? 'Alterando...'
                      : 'Confirmar nova senha'}
                  </button>

                </div>

              </form>
            )}

          </section>

        </section>

      </section>

    </main>
  )
}

export default Perfil