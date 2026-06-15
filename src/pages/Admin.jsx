import { useEffect, useState } from "react";
import BarraNavegacao from "../components/NavigationBar";
import Botao from "../components/Button";
import ConfirmationModal from "../components/ConfirmationModal";
import { listarDenuncias, aprovarDenuncia, recusarDenuncia } from "../services";
import "./Admin.css";

const MOTIVOS_TRADUZIDOS = {
  ANUNCIO_FALSO: "Anúncio Falso / Golpe",
  DESACORDO_POLITICAS: "Desacordo com as Políticas",
  DISCRIMINACAO: "Discriminação / Ofensa",
  FERRAMENTA_DIFERENTE: "Ferramenta Diferente do Anúncio",
};

const Admin = () => {
  const [denuncias, setDenuncias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  const [modalConfig, setModalConfig] = useState({ aberto: false, tipo: "", denunciaId: null });

  const carregarDenuncias = async () => {
    try {
      setCarregando(true);
      const dados = await listarDenuncias("PENDENTE");
      setDenuncias(dados || []);
    } catch (error) {
      setMensagem({
        texto: `Erro ao carregar denúncias: ${error.message}`,
        tipo: "erro",
      });
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDenuncias();
  }, []);

  const handleAprovar = (id) => {
    setModalConfig({ aberto: true, tipo: "aprovar", denunciaId: id });
  };

  const handleRecusar = (id) => {
    setModalConfig({ aberto: true, tipo: "recusar", denunciaId: id });
  };

  const confirmarAcao = async () => {
    const { tipo, denunciaId } = modalConfig;
    setModalConfig({ aberto: false, tipo: "", denunciaId: null });

    if (tipo === "aprovar") {
      try {
        const denuncia = denuncias.find((d) => d.id === denunciaId);
        await aprovarDenuncia(denunciaId);
        
        if (denuncia) {
          const todosAlugueis = JSON.parse(localStorage.getItem("lokei_todos_alugueis") || "[]");
          const filtrados = todosAlugueis.filter(a => Number(a.anuncioId) !== Number(denuncia.anuncioId));
          localStorage.setItem("lokei_todos_alugueis", JSON.stringify(filtrados));
        }

        setMensagem({
          texto: "Denúncia aprovada com sucesso! O anúncio foi desativado.",
          tipo: "sucesso",
        });
        setDenuncias((prev) => prev.filter((d) => d.id !== denunciaId));
      } catch (error) {
        setMensagem({
          texto: `Erro ao aprovar denúncia: ${error.message}`,
          tipo: "erro",
        });
      }
    } else if (tipo === "recusar") {
      try {
        await recusarDenuncia(denunciaId);
        setMensagem({
          texto: "Denúncia recusada com sucesso.",
          tipo: "sucesso",
        });
        setDenuncias((prev) => prev.filter((d) => d.id !== denunciaId));
      } catch (error) {
        setMensagem({
          texto: `Erro ao recusar denúncia: ${error.message}`,
          tipo: "erro",
        });
      }
    }
  };

  return (
    <div className="adminPage">
      <BarraNavegacao />
      <div className="adminContainer">
        <header className="adminHeader">
          <span className="adminBadge">Moderação</span>
          <h1>Painel do Administrador</h1>
          <p>Gerencie denúncias de anúncios e garanta a segurança da comunidade.</p>
        </header>

        {mensagem.texto ? (
          <div className={`adminAlert adminAlert--${mensagem.tipo}`}>
            <span>{mensagem.texto}</span>
            <button
              className="adminAlertClose"
              onClick={() => setMensagem({ texto: "", tipo: "" })}
            >
              ×
            </button>
          </div>
        ) : null}

        <div className="adminContent">
          <h2>Denúncias Pendentes ({denuncias.length})</h2>

          {carregando ? (
            <p className="adminLoading">Carregando denúncias...</p>
          ) : denuncias.length === 0 ? (
            <div className="adminEmpty">
              <div className="adminEmptyIcon">✓</div>
              <h3>Tudo limpo!</h3>
              <p>Nenhuma denúncia pendente de moderação no momento.</p>
            </div>
          ) : (
            <div className="adminGrid">
              {denuncias.map((denuncia) => (
                <article key={denuncia.id} className="adminCard">
                  <header className="adminCardHeader">
                    <span className="adminCardReason">
                      {MOTIVOS_TRADUZIDOS[denuncia.motivo] || denuncia.motivo}
                    </span>
                    <span className="adminCardId">ID: #{denuncia.id}</span>
                  </header>

                  <div className="adminCardBody">
                    <p className="adminCardDesc">{denuncia.descricao}</p>
                    <div className="adminCardMeta">
                      <span>
                        <strong>Anúncio ID:</strong> {denuncia.anuncioId}
                      </span>
                      <span>
                        <strong>Denunciante ID:</strong> {denuncia.denuncianteId}
                      </span>
                    </div>
                  </div>

                  <footer className="adminCardFooter">
                    <button
                      className="adminBtn adminBtn--recusar"
                      onClick={() => handleRecusar(denuncia.id)}
                    >
                      Recusar
                    </button>
                    <button
                      className="adminBtn adminBtn--aprovar"
                      onClick={() => handleAprovar(denuncia.id)}
                    >
                      Aprovar e Desativar
                    </button>
                  </footer>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        aberto={modalConfig.aberto}
        aoFechar={() => setModalConfig({ aberto: false, tipo: "", denunciaId: null })}
        aoConfirmar={confirmarAcao}
        titulo={modalConfig.tipo === "aprovar" ? "Aprovar Denúncia" : "Recusar Denúncia"}
        descricao={
          modalConfig.tipo === "aprovar"
            ? "Tem certeza que deseja aprovar esta denúncia? O anúncio será desativado permanentemente."
            : "Tem certeza que deseja recusar esta denúncia?"
        }
        textoConfirmar={modalConfig.tipo === "aprovar" ? "Sim, Aprovar" : "Sim, Recusar"}
        textoCancelar="Cancelar"
        varianteConfirmar={modalConfig.tipo === "aprovar" ? "outlineRed" : "primary"}
      />
    </div>
  );
};

export default Admin;
