import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { atualizarPerfil } from "../services/usuarios";

import CampoEntrada from "../components/Input";
import Botao from "../components/Button";
import BarraNavegacao from "../components/NavigationBar";
import "./EditarPerfil.css";

const EditarPerfil = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("lokei_user_id") || "1";

  const [nome, setNome] = useState(localStorage.getItem(`lokei_nome_${userId}`) || localStorage.getItem("lokei_nome") || "Usuário Teste");
  const [email, setEmail] = useState(localStorage.getItem(`lokei_email_${userId}`) || localStorage.getItem("lokei_email") || "teste@email.com");
  const [telefone, setTelefone] = useState(localStorage.getItem(`lokei_telefone_${userId}`) || localStorage.getItem("lokei_telefone") || "(64) 99999-9999");
  const [cpf] = useState(localStorage.getItem(`lokei_cpf_${userId}`) || localStorage.getItem("lokei_cpf") || "123.456.789-01");
  const [cep, setCep] = useState(localStorage.getItem(`lokei_cep_${userId}`) || "");
  const [logradouro, setLogradouro] = useState(localStorage.getItem(`lokei_logradouro_${userId}`) || "");
  const [numero, setNumero] = useState(localStorage.getItem(`lokei_numero_${userId}`) || "");
  const [complemento, setComplemento] = useState(localStorage.getItem(`lokei_complemento_${userId}`) || "");
  const [bairro, setBairro] = useState(localStorage.getItem(`lokei_bairro_${userId}`) || "");
  const [cidade, setCidade] = useState(localStorage.getItem(`lokei_cidade_${userId}`) || "");
  const [estado, setEstado] = useState(localStorage.getItem(`lokei_estado_${userId}`) || "");
  const [erros, setErros] = useState({});
  const [modalAberto, setModalAberto] = useState(false);
  const [loading, setLoading] = useState(false);

  const validar = () => {
    const proximosErros = {};

    if (!nome.trim()) proximosErros.nome = "Informe o nome completo.";
    if (!telefone.trim()) proximosErros.telefone = "Informe o telefone.";
    if (!cep.trim()) proximosErros.cep = "Campo obrigatório.";
    if (!logradouro.trim()) proximosErros.logradouro = "Campo obrigatório.";
    if (!numero.trim()) proximosErros.numero = "Campo obrigatório.";
    if (!bairro.trim()) proximosErros.bairro = "Campo obrigatório.";
    if (!cidade.trim()) proximosErros.cidade = "Campo obrigatório.";
    if (!estado.trim()) proximosErros.estado = "Campo obrigatório.";

    return proximosErros;
  };

  const handleSubmit = async (evento) => {
    evento.preventDefault();
    const proximosErros = validar();
    setErros(proximosErros);
    if (Object.keys(proximosErros).length > 0) return;

    try {
        setLoading(true);
        // Salva os dados do perfil principal no backend
        const dadosSalvos = await atualizarPerfil(userId, {
            nome,
            email,
            telefone
        });

        // Atualiza as chaves do localStorage com a resposta da API
        localStorage.setItem(`lokei_nome_${userId}`, dadosSalvos.nome);
        localStorage.setItem(`lokei_email_${userId}`, dadosSalvos.email);
        localStorage.setItem(`lokei_telefone_${userId}`, dadosSalvos.telefone);

        // Endereços continuam sendo salvos localmente por enquanto
        localStorage.setItem(`lokei_cep_${userId}`, cep);
        localStorage.setItem(`lokei_logradouro_${userId}`, logradouro);
        localStorage.setItem(`lokei_numero_${userId}`, numero);
        localStorage.setItem(`lokei_complemento_${userId}`, complemento);
        localStorage.setItem(`lokei_bairro_${userId}`, bairro);
        localStorage.setItem(`lokei_cidade_${userId}`, cidade);
        localStorage.setItem(`lokei_estado_${userId}`, estado);

        // Keep global generic for compatibility with Perfil.jsx
        localStorage.setItem("lokei_nome", dadosSalvos.nome);
        localStorage.setItem("lokei_email", dadosSalvos.email);
        localStorage.setItem("lokei_telefone", dadosSalvos.telefone);

        setModalAberto(true);
    } catch (error) {
        alert("Falha ao salvar no servidor: " + error.message);
    } finally {
        setLoading(false);
    }
  };

  const fecharModal = () => {
    setModalAberto(false);
    navigate("/perfil");
  };

  return (
    <div className="editarPerfilPage">
      <BarraNavegacao />
      <div className="editarPerfilLayout">
        <section className="editarPerfilMain">
          <header className="editarPerfilHeader">
            <span className="editarPerfilBadge">Meus Dados</span>
            <h1>Editar Perfil</h1>
            <p>Atualize suas informacoes com seguranca e clareza.</p>
          </header>
          <form className="editarPerfilForm" onSubmit={handleSubmit}>
              <div className="editarPerfilSection">
                <div className="editarPerfilSectionHeader">
                  <p className="editarPerfilSectionTitle">1. Dados Pessoais</p>
                  <span className="editarPerfilSectionHint">
                    Informacoes para identificar sua conta.
                  </span>
                </div>
                <div className="editarPerfilFieldGroup">
                  <CampoEntrada
                    rotulo="Nome Completo"
                    value={nome}
                    onChange={(evento) => setNome(evento.target.value)}
                    erro={erros.nome}
                    obrigatorio
                  />
                  <CampoEntrada
                    rotulo="E-mail"
                    type="email"
                    value={email}
                    onChange={(evento) => setEmail(evento.target.value)}
                    obrigatorio
                  />
                  <CampoEntrada
                    rotulo="Telefone"
                    value={telefone}
                    onChange={(evento) => setTelefone(evento.target.value)}
                    erro={erros.telefone}
                    obrigatorio
                  />
                  <div className="editarPerfilCpf">
                    <div className="editarPerfilCpfHeader">
                      <span className="editarPerfilCpfLabel">CPF <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span></span>
                      <span className="editarPerfilCpfLock" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                          <path d="M7 11V8a5 5 0 0 1 10 0v3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                          <rect x="5" y="11" width="14" height="9" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
                        </svg>
                      </span>
                    </div>
                    <div className="editarPerfilCpfValue">{cpf}</div>
                    <p className="editarPerfilCpfHint">
                      CPF bloqueado por seguranca e regra do cadastro.
                    </p>
                  </div>
                </div>
              </div>

              <div className="editarPerfilSection">
                <div className="editarPerfilSectionHeader">
                  <p className="editarPerfilSectionTitle">2. Endereco</p>
                  <span className="editarPerfilSectionHint">
                    Use este endereco para retiradas e entregas.
                  </span>
                </div>
                <div className="editarPerfilFieldGroup">
                  <CampoEntrada
                    rotulo="CEP"
                    value={cep}
                    onChange={(evento) => setCep(evento.target.value)}
                    placeholder="00000-000"
                    erro={erros.cep}
                    obrigatorio
                  />
                  <CampoEntrada
                    rotulo="Logradouro"
                    value={logradouro}
                    onChange={(evento) => setLogradouro(evento.target.value)}
                    placeholder="Rua, avenida"
                    erro={erros.logradouro}
                    obrigatorio
                  />
                  <div className="editarPerfilFieldRow">
                    <CampoEntrada
                      rotulo="Numero"
                      value={numero}
                      onChange={(evento) => setNumero(evento.target.value)}
                      placeholder="Numero"
                      erro={erros.numero}
                      obrigatorio
                    />
                    <CampoEntrada
                      rotulo="Complemento"
                      value={complemento}
                      onChange={(evento) => setComplemento(evento.target.value)}
                      placeholder="Apartamento, bloco"
                    />
                  </div>
                  <CampoEntrada
                    rotulo="Bairro"
                    value={bairro}
                    onChange={(evento) => setBairro(evento.target.value)}
                    placeholder="Seu bairro"
                    erro={erros.bairro}
                    obrigatorio
                  />
                  <div className="editarPerfilFieldRow">
                    <CampoEntrada
                      rotulo="Cidade"
                      value={cidade}
                      onChange={(evento) => setCidade(evento.target.value)}
                      placeholder="Cidade"
                      erro={erros.cidade}
                      obrigatorio
                    />
                    <CampoEntrada
                      rotulo="Estado"
                      value={estado}
                      onChange={(evento) => setEstado(evento.target.value)}
                      placeholder="UF"
                      erro={erros.estado}
                      obrigatorio
                    />
                  </div>
                </div>
              </div>

            <div className="editarPerfilActions">
              <Link className="editarPerfilCancel" to="/perfil">
                Cancelar e voltar
              </Link>
              <Botao type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Alteracoes"}
              </Botao>
            </div>
          </form>
        </section>
      </div>

      {modalAberto && (
        <div className="modalOverlay" onClick={fecharModal} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="modalContent" onClick={e => e.stopPropagation()} style={{ background: "#fff", padding: "30px", borderRadius: "12px", textAlign: "center", maxWidth: "400px", width: "90%", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#e8f5e9", color: "#4caf50", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", margin: "0 auto 20px" }}>✓</div>
            <h2 style={{ margin: "0 0 10px", fontSize: "1.2rem", color: "#333" }}>Alterações Salvas!</h2>
            <p style={{ margin: "0 0 24px", color: "#666", fontSize: "0.95rem", lineHeight: "1.4" }}>O seu endereço e dados pessoais foram atualizados com sucesso.</p>
            <Botao onClick={fecharModal} style={{ width: "100%" }}>Continuar</Botao>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarPerfil;

