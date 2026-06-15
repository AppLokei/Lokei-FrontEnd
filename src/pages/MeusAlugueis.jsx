import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CardAluguel from "../components/RentalCard";
import BarraNavegacao from "../components/NavigationBar";
import { buscarAlugueisPorUsuario } from "../services";
import ConfirmationModal from "../components/ConfirmationModal";
import "./MeusAlugueis.css";

const defaultItensLocatario = [];
const itensLocador = [];

const MeusAlugueis = () => {
  const role = localStorage.getItem("lokei_role") || "locatario";
  const [abaAtiva, setAbaAtiva] = useState(role === "locador" ? "emprestados" : "alugando");
  const [modalConfirmacao, setModalConfirmacao] = useState({
    aberto: false,
    tipo: "", // "cancelar" | "reprovar"
    aluguelId: null,
    tituloAluguel: "",
  });
  const [itensLocatario, setItensLocatario] = useState([]);
  const [emprestados, setEmprestados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const carregar = async () => {
      try {
        setCarregando(true);
        setErro("");
        
        const usuarioId = Number(localStorage.getItem("lokei_user_id") || 1);
        
        const dados = await buscarAlugueisPorUsuario(usuarioId);
        const backendMapeado = dados.map((aluguel) => ({
          id: aluguel.id,
          titulo: `Aluguel #${aluguel.id} - Anúncio #${aluguel.anuncioId}`,
          periodo: `${new Date(aluguel.dataInicio).toLocaleDateString("pt-BR")} a ${new Date(aluguel.dataFim).toLocaleDateString("pt-BR")}`,
          status: String(aluguel.status || "confirmado").toLowerCase(),
          imagem:
            "https://images.unsplash.com/photo-1586864387789-628af9feed72?auto=format&fit=crop&w=800&q=80",
          locatarioId: aluguel.locatarioId,
          locadorId: aluguel.locadorId || (aluguel.anuncioId === 1 ? 1 : 2), // Mock locador if missing for now
          anuncioId: aluguel.anuncioId
        }));

        const meusAlugueis = backendMapeado.filter(a => Number(a.locatarioId) === usuarioId);
        const meusEmprestimos = backendMapeado.filter(a => Number(a.locatarioId) !== usuarioId);

        setItensLocatario(meusAlugueis);
        setEmprestados(meusEmprestimos);
      } catch (err) {
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, [role]);

  const [meusAnuncios, setMeusAnuncios] = useState([]);
  const [carregandoAnuncios, setCarregandoAnuncios] = useState(false);

  useEffect(() => {
    if (abaAtiva === "anuncios") {
      const carregarAnuncios = async () => {
        try {
          setCarregandoAnuncios(true);
          const userId = localStorage.getItem("lokei_user_id") || "1";
          const res = await fetch(`/api/anuncios-por-usuario?identificador=${userId}`);
          if (!res.ok) throw new Error("Erro ao carregar anúncios");
          const data = await res.json();
          const anunciosMapeados = (data.content || []).map(a => ({
            id: a.id,
            titulo: a.titulo,
            periodo: `R$ ${a.valorDiario}/dia`,
            status: a.status === "PAUSADO" ? "pausado" : "ativo",
            imagem: a.imagens?.[0] || "",
          }));
          setMeusAnuncios(anunciosMapeados);
        } catch (error) {
          console.error(error);
        } finally {
          setCarregandoAnuncios(false);
        }
      };
      carregarAnuncios();
    }
  }, [abaAtiva]);

  const adicionarNotificacao = (usuarioAlvoId, texto, tipo = "success") => {
    const key = `lokei_notificacoes_${usuarioAlvoId}`;
    const notifs = JSON.parse(localStorage.getItem(key) || "[]");
    const novaNotif = {
      id: Date.now(),
      texto,
      hora: "Agora",
      tipo,
      lido: false,
    };
    localStorage.setItem(key, JSON.stringify([novaNotif, ...notifs]));
  };

  const handleOwnerAction = async (id, acao) => {
    try {
      const { atualizarStatusAluguel } = await import("../services");
      let novoStatus = "";
      if (acao === "aprovar") novoStatus = "CONFIRMADO";
      else if (acao === "reprovar") novoStatus = "REPROVADO";
      else if (acao === "confirmar_pagamento_entrega") novoStatus = "EM_ANDAMENTO";
      else if (acao === "finalizar") novoStatus = "CONCLUIDO";
      else return;

      await atualizarStatusAluguel(id, novoStatus);
      
      const item = emprestados.find(i => i.id === id) || itensLocatario.find(i => i.id === id);
      if (item) {
        if (acao === "aprovar") {
          adicionarNotificacao(item.locatarioId, `Sua solicitação de aluguel para a ferramenta "${item.titulo}" foi aprovada!`, "success");
        } else if (acao === "reprovar") {
          adicionarNotificacao(item.locatarioId, `Sua solicitação de aluguel para a ferramenta "${item.titulo}" foi recusada.`, "alert");
        } else if (acao === "confirmar_pagamento_entrega") {
          adicionarNotificacao(item.locatarioId, `Pagamento e entrega confirmados para a ferramenta "${item.titulo}". O aluguel está em andamento!`, "success");
        } else if (acao === "finalizar") {
          adicionarNotificacao(item.locatarioId, `O aluguel da ferramenta "${item.titulo}" foi concluído. Clique para avaliar!`, "success");
        }
      }

      const usuarioId = Number(localStorage.getItem("lokei_user_id") || 1);
      const dados = await buscarAlugueisPorUsuario(usuarioId);
      const backendMapeado = dados.map((aluguel) => ({
        id: aluguel.id,
        titulo: `Aluguel #${aluguel.id} - Anúncio #${aluguel.anuncioId}`,
        periodo: `${new Date(aluguel.dataInicio).toLocaleDateString("pt-BR")} a ${new Date(aluguel.dataFim).toLocaleDateString("pt-BR")}`,
        status: String(aluguel.status || "confirmado").toLowerCase(),
        imagem:
          "https://images.unsplash.com/photo-1586864387789-628af9feed72?auto=format&fit=crop&w=800&q=80",
        locatarioId: aluguel.locatarioId,
        locadorId: aluguel.locadorId || (aluguel.anuncioId === 1 ? 1 : 2),
        anuncioId: aluguel.anuncioId
      }));

      const meusAlugueis = backendMapeado.filter(a => Number(a.locatarioId) === usuarioId);
      const meusEmprestimos = backendMapeado.filter(a => Number(a.locatarioId) !== usuarioId);

      setItensLocatario(meusAlugueis);
      setEmprestados(meusEmprestimos);
    } catch (err) {
      alert(`Erro ao atualizar status: ${err.message}`);
    }
  };

  return (
    <div className="rentalsPage">
      <BarraNavegacao />
      <div className="rentalsContainer">
        <header className="rentalsHeader">
          <h1>Gerenciamento</h1>
          <p>Gerencie seus pedidos, aluguéis e anúncios.</p>
        </header>

        <div className="rentalsTabs" style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <button
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              background: abaAtiva === "alugando" ? "var(--color-primary, #e6b121)" : "#f1f1f1",
              color: abaAtiva === "alugando" ? "#000" : "#333",
              fontWeight: "bold",
              cursor: "pointer"
            }}
            onClick={() => setAbaAtiva("alugando")}
          >
            Ferramentas Alugadas
          </button>
          <button
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              background: abaAtiva === "emprestados" ? "var(--color-primary, #e6b121)" : "#f1f1f1",
              color: abaAtiva === "emprestados" ? "#000" : "#333",
              fontWeight: "bold",
              cursor: "pointer"
            }}
            onClick={() => setAbaAtiva("emprestados")}
          >
            Ferramentas Emprestadas
          </button>
          <button
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              background: abaAtiva === "anuncios" ? "var(--color-primary, #e6b121)" : "#f1f1f1",
              color: abaAtiva === "anuncios" ? "#000" : "#333",
              fontWeight: "bold",
              cursor: "pointer"
            }}
            onClick={() => setAbaAtiva("anuncios")}
          >
            Meus Anúncios
          </button>
        </div>

        <div className="rentalsList">
          {abaAtiva === "anuncios"
            ? carregandoAnuncios ? (
                <p>Carregando anuncios...</p>
              ) : meusAnuncios.length === 0 ? (
                <p>Voce nao possui anuncios cadastrados.</p>
              ) : (
                meusAnuncios.map((anuncio) => (
                  <CardAluguel
                    key={`anuncio-${anuncio.id}`}
                    titulo={anuncio.titulo}
                    periodo={anuncio.periodo}
                    status={anuncio.status}
                    imagem={anuncio.imagem}
                    hrefAnuncio={`/anuncios/${anuncio.id}`}
                    acao={{
                      rotulo: anuncio.status === "pausado" ? "Reativar" : "Pausar",
                      variante: "outlineYellow",
                      aoClicar: () =>
                        setModalConfirmacao({
                          aberto: true,
                          tipo: anuncio.status === "pausado" ? "reativar_anuncio" : "pausar_anuncio",
                          aluguelId: anuncio.id, // Using this to hold the anuncio ID
                          tituloAluguel: anuncio.titulo,
                        }),
                    }}
                  />
                ))
              )
            : abaAtiva === "alugando"
            ? itensLocatario.map((aluguel) => {
                const acao =
                  aluguel.status === "em_aprovacao"
                    ? {
                      rotulo: "Cancelar Solicitacao",
                      variante: "outlineRed",
                      aoClicar: () =>
                        setModalConfirmacao({
                          aberto: true,
                          tipo: "cancelar",
                          aluguelId: aluguel.id,
                          tituloAluguel: aluguel.titulo,
                        }),
                    }
                    : aluguel.status === "em_andamento"
                      ? {
                          rotulo: "Abrir Chat",
                          variante: "outlineYellow",
                          aoClicar: () => navigate("/chat"),
                        }
                      : aluguel.status === "concluido"
                        ? {
                            rotulo: "Avaliar",
                            variante: "primary",
                            aoClicar: () => navigate("/avaliar", { state: { aluguel } }),
                          }
                        : null;

                return (
                  <CardAluguel
                    key={aluguel.id}
                    titulo={aluguel.titulo}
                    periodo={aluguel.periodo}
                    status={aluguel.status}
                    imagem={aluguel.imagem}
                    acao={acao}
                    hrefAnuncio={aluguel.anuncioId ? `/anuncios/${aluguel.anuncioId}` : null}
                  />
                );
              })
            : carregando ? (
                <p>Carregando aluguéis...</p>
              ) : erro ? (
                <p>Erro: {erro}</p>
              ) : emprestados.length === 0 ? (
                <p>Nenhum aluguel emprestado encontrado.</p>
              ) : (
                emprestados.map((aluguel) => {
                  const acoesLocador =
                    aluguel.status === "confirmado"
                      ? [
                          {
                            rotulo: "Confirmar Pagamento e Entrega",
                            variante: "primary",
                            aoClicar: () =>
                              handleOwnerAction(aluguel.id, "confirmar_pagamento_entrega"),
                          },
                        ]
                      : aluguel.status === "em_aprovacao"
                        ? [
                            {
                              rotulo: "Aprovar",
                              variante: "solidGreen",
                              aoClicar: () => handleOwnerAction(aluguel.id, "aprovar"),
                            },
                            {
                              rotulo: "Reprovar",
                              variante: "outlineRed",
                              aoClicar: () =>
                                setModalConfirmacao({
                                  aberto: true,
                                  tipo: "reprovar",
                                  aluguelId: aluguel.id,
                                  tituloAluguel: aluguel.titulo,
                                }),
                            },
                          ]
                        : aluguel.status === "em_andamento"
                          ? [
                              {
                                rotulo: "Finalizar Aluguel",
                                variante: "primary",
                                aoClicar: () => handleOwnerAction(aluguel.id, "finalizar"),
                              },
                            ]
                          : null;

                  return (
                    <CardAluguel
                      key={aluguel.id}
                      titulo={aluguel.titulo}
                      periodo={aluguel.periodo}
                      status={aluguel.status}
                      imagem={aluguel.imagem}
                      acoesLocador={acoesLocador}
                      hrefAnuncio={aluguel.anuncioId ? `/anuncios/${aluguel.anuncioId}` : null}
                    />
                  );
                })
              )}
        </div>

        <ConfirmationModal
          aberto={modalConfirmacao.aberto}
          aoFechar={() =>
            setModalConfirmacao({
              aberto: false,
              tipo: "",
              aluguelId: null,
              tituloAluguel: "",
            })
          }
          aoConfirmar={() => {
            if (modalConfirmacao.tipo === "cancelar") {
              handleOwnerAction(modalConfirmacao.aluguelId, "reprovar");
            } else if (modalConfirmacao.tipo === "reprovar") {
              handleOwnerAction(modalConfirmacao.aluguelId, "reprovar");
            } else if (modalConfirmacao.tipo === "pausar_anuncio") {
              // Call the pause service
              import("../services").then(({ pausarAnuncio }) => {
                pausarAnuncio(modalConfirmacao.aluguelId).then(() => {
                  setAbaAtiva("emprestados");
                  setTimeout(() => setAbaAtiva("anuncios"), 50); // Refresh
                });
              });
            } else if (modalConfirmacao.tipo === "reativar_anuncio") {
              import("../services").then(({ reativarAnuncio }) => {
                reativarAnuncio(modalConfirmacao.aluguelId).then(() => {
                  setAbaAtiva("emprestados");
                  setTimeout(() => setAbaAtiva("anuncios"), 50); // Refresh
                });
              });
            }
            setModalConfirmacao({
              aberto: false,
              tipo: "",
              aluguelId: null,
              tituloAluguel: "",
            });
          }}
          titulo={
            modalConfirmacao.tipo === "cancelar"
              ? "Cancelar solicitação?"
              : modalConfirmacao.tipo === "reprovar"
              ? "Reprovar solicitação?"
              : modalConfirmacao.tipo === "pausar_anuncio"
              ? "Pausar anúncio?"
              : "Reativar anúncio?"
          }
          descricao={
            <p>
              Tem certeza que deseja{" "}
              {modalConfirmacao.tipo === "cancelar" ? "cancelar" : 
               modalConfirmacao.tipo === "reprovar" ? "reprovar" :
               modalConfirmacao.tipo === "pausar_anuncio" ? "pausar" : "reativar"} {" "}
              {modalConfirmacao.tipo.includes("anuncio") ? "o anúncio" : "o pedido de aluguel para"} <strong>{modalConfirmacao.tituloAluguel}</strong>?
            </p>
          }
          textoConfirmar={
            modalConfirmacao.tipo === "cancelar"
              ? "Confirmar Cancelamento"
              : modalConfirmacao.tipo === "reprovar"
              ? "Reprovar Solicitação"
              : modalConfirmacao.tipo === "pausar_anuncio"
              ? "Pausar Anúncio"
              : "Reativar Anúncio"
          }
          varianteConfirmar={modalConfirmacao.tipo.includes("anuncio") ? "outlineYellow" : "outlineRed"}
        />
      </div>
    </div>
  );
};

export default MeusAlugueis;
