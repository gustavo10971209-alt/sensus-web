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

function Perfil() {
  const navigate = useNavigate()

  // =========================================
  // PERFIL
  // =========================================

  const [
    psicologo,
    setPsicologo,
  ] = useState(null)

  const [
    nome,
    setNome,
  ] = useState('')

  const [
    crp,
    setCrp,
  ] = useState('')

  const [
    telefone,
    setTelefone,
  ] = useState('')

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

  // =========================================
  // SENHA
  // =========================================

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

  // =========================================
  // CARREGAR PERFIL
  // =========================================

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

        setPsicologo(dados)

        setNome(
          dados.Name || ''
        )

        setCrp(
          dados.CRP || ''
        )

        setTelefone(
          dados.Phone || ''
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

  // =========================================
  // EDIÇÃO DO PERFIL
  // =========================================

  function iniciarEdicao() {
    setMensagem('')
    setErro('')
    setEditando(true)
  }

  function cancelarEdicao() {
    setNome(
      psicologo?.Name || ''
    )

    setCrp(
      psicologo?.CRP || ''
    )

    setTelefone(
      psicologo?.Phone || ''
    )

    setErro('')
    setMensagem('')
    setEditando(false)
  }

  async function salvarPerfil(
    event
  ) {
    event.preventDefault()

    if (!nome.trim()) {
      setErro(
        'Informe seu nome.'
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
          crp,
          telefone,
        })

      setPsicologo(atualizado)

      setNome(
        atualizado.Name || ''
      )

      setCrp(
        atualizado.CRP || ''
      )

      setTelefone(
        atualizado.Phone || ''
      )

      setEditando(false)

      setMensagem(
        'Perfil atualizado com sucesso.'
      )
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

  // =========================================
  // ALTERAÇÃO DE SENHA
  // =========================================

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
    setAlterandoSenha(false)
  }

  async function alterarSenha(
    event
  ) {
    event.preventDefault()

    setErroSenha('')
    setMensagemSenha('')

    if (novaSenha.length < 6) {
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
          password: novaSenha,
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

  // =========================================
  // LOGOUT
  // =========================================

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

  // =========================================
  // CARREGAMENTO
  // =========================================

  if (carregando) {
    return (
      <main className="perfil-carregando">
        <p>
          Carregando perfil...
        </p>
      </main>
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

      {/* CONTEÚDO */}

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

          {/* DADOS PROFISSIONAIS */}

          <form
            onSubmit={salvarPerfil}
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
                  value={nome}
                  onChange={(event) =>
                    setNome(
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
                    psicologo?.Email || ''
                  }
                  disabled
                />

              </div>

              <div className="campo">

                <label htmlFor="perfil-crp">
                  CRP
                </label>

                <input
                  id="perfil-crp"
                  type="text"
                  value={crp}
                  onChange={(event) =>
                    setCrp(
                      event.target.value
                    )
                  }
                  placeholder={
                    editando
                      ? 'Ex.: 20/12345'
                      : 'Não informado'
                  }
                  disabled={!editando}
                />

              </div>

              <div className="campo">

                <label htmlFor="perfil-telefone">
                  Telefone
                </label>

                <input
                  id="perfil-telefone"
                  type="tel"
                  value={telefone}
                  onChange={(event) =>
                    setTelefone(
                      event.target.value
                    )
                  }
                  placeholder={
                    editando
                      ? '(00) 00000-0000'
                      : 'Não informado'
                  }
                  disabled={!editando}
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
                  onClick={iniciarEdicao}
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
                    disabled={salvando}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="botao-entrar perfil-botao-principal"
                    disabled={salvando}
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
                onSubmit={alterarSenha}
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
                      value={novaSenha}
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
                      value={confirmarSenha}
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
                    disabled={salvandoSenha}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="botao-entrar perfil-botao-principal"
                    disabled={salvandoSenha}
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