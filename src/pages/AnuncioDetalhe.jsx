import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CampoEntrada from "../components/Input";
import Botao from "../components/Button";
import BarraNavegacao from "../components/NavigationBar";
import ConfirmationModal from "../components/ConfirmationModal";
import { buscarAnuncioPorId, formatarMoeda, desativarAnuncio, iniciarChat, pausarAnuncio, reativarAnuncio, consultarDisponibilidade, solicitarAluguel } from "../services";
import "./AnuncioDetalhe.css";

const paraData = (valor) => {
  if (!valor) return null;
  const [ano, mes, dia] = valor.split("-").map(Number);
  return new Date(ano, mes - 1, dia);
};

const diferencaEmDias = (dataInicio, dataFim) => {
  const diff = dataFim - dataInicio;
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
};

const AnuncioDetalhe = () => {
  const role = localStorage.getItem("lokei_role") || "locatario";
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [erros, setErros] = useState({});
  const [anuncio, setAnuncio] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [locadorDados, setLocadorDados] = useState(null);
  const [periodosReservados, setPeriodosReservados] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [modalSolicitarAberto, setModalSolicitarAberto] = useState(false);
  const [modalSucessoAberto, setModalSucessoAberto] = useState(false);
  const [modalPausarAberto, setModalPausarAberto] = useState(false);
  const [modalBloqueioChatAberto, setModalBloqueioChatAberto] = useState(false);

  const [imagemAtivaIndex, setImagemAtivaIndex] = useState(0);
  const [fullscreenAberto, setFullscreenAberto] = useState(false);

  const irParaProximaImagem = (e) => {
    if (e) e.stopPropagation();
    if (!anuncio?.imagens) return;
    setImagemAtivaIndex((prev) => (prev + 1) % anuncio.imagens.length);
  };

  const irParaImagemAnterior = (e) => {
    if (e) e.stopPropagation();
    if (!anuncio?.imagens) return;
    setImagemAtivaIndex((prev) => (prev - 1 + anuncio.imagens.length) % anuncio.imagens.length);
  };

  const souDono = useMemo(() => {
    if (!anuncio) return false;
    return Number(anuncio.usuarioId) === Number(localStorage.getItem("lokei_user_id"));
  }, [anuncio]);

  const valorHoje = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const resumoSelecao = useMemo(() => {
    const inicio = paraData(dataInicio);
    const fim = paraData(dataFim);
    if (!inicio || !fim) return null;
    const dias = diferencaEmDias(inicio, fim);
    if (Number.isNaN(dias) || dias <= 0) return null;
    const diaria = Number(anuncio?.valorDiario ?? 0);
    const total = dias * diaria;
    return `${dias} dias x ${formatarMoeda(diaria)} = ${formatarMoeda(total)}`;
  }, [dataInicio, dataFim, anuncio]);

  useEffect(() => {
    let mounted = true;
    const fetchAnuncio = async () => {
      try {
        setCarregando(true);
        const usuarioLogadoId = localStorage.getItem("lokei_user_id");
        const data = await buscarAnuncioPorId(id, usuarioLogadoId);
        if (!data) throw new Error("Anúncio não encontrado");

        if (mounted) {
          setAnuncio(data);

          if (data.proprietario) {
            setLocadorDados(data.proprietario);
          }

          consultarDisponibilidade(id)
            .then((disponibilidade) => {
              if (mounted && disponibilidade) {
                setPeriodosReservados(disponibilidade.periodosReservados ?? []);
              }
            })
            .catch((err) => console.error("Erro ao consultar disponibilidade", err));
        }
      } catch (err) {
        if (mounted) setErro(err.message);
      } finally {
        if (mounted) setCarregando(false);
      }
    };
    fetchAnuncio();
    return () => { mounted = false; };
  }, [id]);

  const validar = () => {
    const proximosErros = {};
    const inicio = paraData(dataInicio);
    const fim = paraData(dataFim);
    const hoje = paraData(valorHoje);

    if (!dataInicio) {
      proximosErros.dataInicio = "Selecione a data de inicio.";
    }

    if (!dataFim) {
      proximosErros.dataFim = "Selecione a data de fim.";
    }

    if (inicio && hoje && inicio < hoje) {
      proximosErros.dataInicio = "A data nao pode ser retroativa.";
    }

    if (inicio && fim && fim < inicio) {
      proximosErros.dataFim = "A data de fim nao pode ser menor.";
    }

    if (inicio && fim) {
      const dias = diferencaEmDias(inicio, fim);
      if (dias > 30) {
        proximosErros.dataFim = "O limite maximo e de 30 dias.";
      }
    }

    if (inicio && fim) {
      const haSobreposicao = periodosReservados.some((periodo) => {
        const pInicio = paraData(periodo.dataInicio);
        const pFim = paraData(periodo.dataFim);
        if (!pInicio || !pFim) return false;
        return inicio <= pFim && fim >= pInicio;
      });

      if (haSobreposicao) {
        proximosErros.dataInicio = "Este periodo ja esta reservado. Escolha outras datas.";
      }
    }

    return proximosErros;
  };

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

  const handleSubmit = () => {
    if (souDono) return;
    const proximosErros = validar();
    setErros(proximosErros);
    if (Object.keys(proximosErros).length > 0) return;

    setModalSolicitarAberto(true);
  };

  const confirmarSolicitacao = async () => {
    const locatarioId = Number(localStorage.getItem("lokei_user_id") || 1);
    const locadorId = Number(anuncio.usuarioId);

    try {
      await solicitarAluguel(id, {
        usuarioId: locatarioId,
        dataInicio,
        dataFim,
      });

      adicionarNotificacao(locatarioId, `Você enviou uma solicitação de aluguel para: ${anuncio.titulo}`, "message");
      adicionarNotificacao(locadorId, `Nova solicitação de aluguel pendente para a sua ferramenta: ${anuncio.titulo}`, "message");

      setModalSolicitarAberto(false);
      setModalSucessoAberto(true);
    } catch (err) {
      setModalSolicitarAberto(false);
      alert(`Erro ao solicitar aluguel: ${err.message}`);
    }
  };

  const handleExcluirClique = () => {
    setModalExcluirAberto(true);
  };

  const confirmarExcluir = async () => {
    try {
      await desativarAnuncio(id);
      setModalExcluirAberto(false);
      alert("Anúncio excluído com sucesso!");
      navigate("/");
    } catch (error) {
      alert(`Erro ao excluir anúncio: ${error.message}`);
    }
  };

  const handlePauseToggle = () => {
    setModalPausarAberto(true);
  };

  const confirmarPausa = async () => {
    try {
      if (anuncio.status === "PAUSADO") {
        await reativarAnuncio(id);
      } else {
        await pausarAnuncio(id);
      }
      const resposta = await buscarAnuncioPorId(id);
      setAnuncio(resposta);
      setModalPausarAberto(false);
    } catch (error) {
      alert(`Erro ao alterar status do anúncio: ${error.message}`);
    }
  };

  const handleOpenChat = async () => {
    try {
      if (anuncio.status === "PAUSADO") {
        setModalBloqueioChatAberto(true);
        return;
      }
      const locatarioId = Number(localStorage.getItem("lokei_user_id") || 1);
      if (anuncio.usuarioId && Number(anuncio.usuarioId) === locatarioId) {
        alert("Você não pode abrir um chat com você mesmo!");
        return;
      }
      const chat = await iniciarChat(anuncio.id, locatarioId);
      navigate("/chat", { state: { activeChatId: chat.id } });
    } catch (error) {
      alert(`Erro ao abrir chat: ${error.message}`);
    }
  };

  return (
    <div className="detailPage">
      <BarraNavegacao />
      <div className="detailContainer">
        {carregando ? <p>Carregando anuncio...</p> : null}
        {erro ? <p>{erro}</p> : null}
        {anuncio ? (
          <>
            <div className="detailContent">
              <div className="detailMedia" style={{ cursor: "pointer" }} onClick={() => setFullscreenAberto(true)}>
                <img
                  src={anuncio.imagens?.[imagemAtivaIndex] ?? ""}
                  alt={anuncio.titulo}
                  className="detailImage"
                />
                {anuncio.imagens?.length > 1 && (
                  <>
                    <button className="galleryArrow left" onClick={irParaImagemAnterior}>
                      <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                    </button>
                    <button className="galleryArrow right" onClick={irParaProximaImagem}>
                      <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                    </button>
                    <div className="galleryDots">
                      {anuncio.imagens.map((_, i) => (
                        <span key={i} className={`galleryDot ${i === imagemAtivaIndex ? "active" : ""}`} onClick={(e) => { e.stopPropagation(); setImagemAtivaIndex(i); }} />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="detailHeader">
                <h1 className="detailTitle" style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  {anuncio.titulo}
                  {anuncio.status === "PAUSADO" && (
                    <span style={{ fontSize: "0.8rem", background: "#f39c12", color: "#fff", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold" }}>
                      PAUSADO
                    </span>
                  )}
                </h1>
                <p className="detailLocation">Local nao informado</p>
              </div>

              <div className="detailSection">
                <h2>Descricao</h2>
                <p>{anuncio.descricao}</p>
              </div>

              <div className="anuncioLocador">
              <div className="anuncioLocadorAvatar">
                {locadorDados ? locadorDados.nome.charAt(0).toUpperCase() : (Number(anuncio.usuarioId) === 2 ? "O" : "T")}
              </div>
              <div className="anuncioLocadorInfo">
                <h3>{locadorDados ? locadorDados.nome : (Number(anuncio.usuarioId) === 2 ? "Outro Teste" : "Usuário Teste")}</h3>
                <span className="anuncioLocadorAvaliacao">
                  {anuncio.totalAvaliacoes > 0
                    ? `★ ${Number(anuncio.notaMedia).toFixed(1)} (${anuncio.totalAvaliacoes} ${anuncio.totalAvaliacoes === 1 ? "avaliação" : "avaliações"})`
                    : "Sem avaliações"}
                </span>
              </div>
            </div>
            </div>

            <aside className="detailBooking">
              <div className="detailBookingCard">
                <div className="detailPriceHero">
                  <span className="detailPriceLabel">Diaria</span>
                  <div className="detailPriceValue">
                    <span>R$</span>
                    <strong>{formatarMoeda(anuncio.valorDiario)}</strong>
                    <small>/dia</small>
                  </div>
                </div>

                {souDono ? (
                  <div className="detailSection" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <Botao type="button" onClick={() => navigate(`/editar-anuncio?id=${id}`)}>
                      Editar anuncio
                    </Botao>
                    <Botao type="button" variante="outline" onClick={handlePauseToggle}>
                      {anuncio.status === "PAUSADO" ? "Reativar anuncio" : "Pausar anuncio"}
                    </Botao>
                    <Botao type="button" variante="outlineRed" onClick={handleExcluirClique}>
                      Excluir anuncio
                    </Botao>
                  </div>
                ) : (
                  <div className="detailSection">
                    {anuncio.status === "PAUSADO" ? (
                      <p style={{ color: "#f39c12", fontWeight: "bold", padding: "10px 0" }}>
                        Este anúncio está pausado temporariamente pelo proprietário.
                      </p>
                    ) : (
                      <>
                        <h2>Selecione o periodo</h2>
                        <p className="detailPolicy">Limite de 30 dias</p>
                        <div className="detailDatesRange">
                          <div className={`dateBox ${erros.dataInicio ? "dateBoxError" : ""}`}>
                            <label>Retirada</label>
                            <input
                              type="date"
                              value={dataInicio}
                              min={valorHoje}
                              onChange={(evento) => setDataInicio(evento.target.value)}
                            />
                          </div>
                          <div className="dateSeparator">
                            <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
                              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                            </svg>
                          </div>
                          <div className={`dateBox ${erros.dataFim ? "dateBoxError" : ""}`}>
                            <label>Devolução</label>
                            <input
                              type="date"
                              value={dataFim}
                              min={dataInicio || valorHoje}
                              onChange={(evento) => setDataFim(evento.target.value)}
                            />
                          </div>
                        </div>
                        {resumoSelecao ? (
                          <div className="detailSummary">{resumoSelecao}</div>
                        ) : null}
                        <Botao type="button" onClick={handleSubmit}>
                          Solicitar Aluguel
                        </Botao>
                      </>
                    )}
                    <button
                      className="detailChatLink"
                      type="button"
                      onClick={handleOpenChat}
                    >
                      Abrir Chat
                    </button>
                  </div>
                )}

                <div className="detailSavings">
                  <h3>Economize</h3>
                  <div className="detailSavingsRow">
                    <span>Semana</span>
                    <strong>{formatarMoeda(Number(anuncio.valorDiario) * 7)}</strong>
                  </div>
                  <div className="detailSavingsRow">
                    <span>Mes</span>
                    <strong>{formatarMoeda(Number(anuncio.valorDiario) * 30)}</strong>
                  </div>
                </div>
              </div>
            </aside>
          </>
        ) : null}
      </div>

      <ConfirmationModal
        aberto={modalSolicitarAberto}
        aoFechar={() => setModalSolicitarAberto(false)}
        aoConfirmar={confirmarSolicitacao}
        titulo="Confirmar Solicitação de Aluguel"
        descricao={`Você deseja solicitar o aluguel da ferramenta "${anuncio?.titulo}" para o período selecionado?`}
        textoConfirmar="Confirmar"
        textoCancelar="Cancelar"
      />

      <ConfirmationModal
        aberto={modalSucessoAberto}
        aoFechar={() => {
          setModalSucessoAberto(false);
          navigate("/");
        }}
        aoConfirmar={() => {
          setModalSucessoAberto(false);
          navigate("/meus-alugueis");
        }}
        titulo="Solicitação Enviada com Sucesso!"
        descricao="Sua solicitação foi enviada para o proprietário. Você receberá uma notificação assim que ela for analisada."
        textoConfirmar="Ver Meus Aluguéis"
        textoCancelar="Ir para Início"
      />

      <ConfirmationModal
        aberto={modalExcluirAberto}
        aoFechar={() => setModalExcluirAberto(false)}
        aoConfirmar={confirmarExcluir}
        titulo="Excluir Anúncio"
        descricao={`Tem certeza que deseja excluir o anúncio "${anuncio?.titulo}"? Esta ação não pode ser desfeita.`}
        textoConfirmar="Excluir"
        textoCancelar="Cancelar"
        varianteConfirmar="outlineRed"
      />

      <ConfirmationModal
        aberto={modalPausarAberto}
        aoFechar={() => setModalPausarAberto(false)}
        aoConfirmar={confirmarPausa}
        titulo={anuncio?.status === "PAUSADO" ? "Reativar Anúncio" : "Pausar Anúncio"}
        descricao={`Tem certeza que deseja ${anuncio?.status === "PAUSADO" ? "reativar" : "pausar"} o anúncio "${anuncio?.titulo}"?`}
        textoConfirmar={anuncio?.status === "PAUSADO" ? "Reativar" : "Pausar"}
        textoCancelar="Cancelar"
        varianteConfirmar="outlineYellow"
      />

      <ConfirmationModal
        aberto={modalBloqueioChatAberto}
        aoFechar={() => setModalBloqueioChatAberto(false)}
        aoConfirmar={() => setModalBloqueioChatAberto(false)}
        titulo="Ação Inválida"
        descricao="Este anúncio encontra-se pausado no momento. Não é possível iniciar ou abrir um chat para um anúncio pausado."
        textoConfirmar="Entendi"
        varianteConfirmar="primary"
      />

      {fullscreenAberto && (
        <div className="fullscreenOverlay" onClick={() => setFullscreenAberto(false)}>
          <button className="fullscreenClose" onClick={(e) => { e.stopPropagation(); setFullscreenAberto(false); }}>
            <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
          </button>
          
          {anuncio.imagens?.length > 1 && (
            <button className="fullscreenArrow left" onClick={irParaImagemAnterior}>
              <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            </button>
          )}
          
          <img 
            src={anuncio.imagens?.[imagemAtivaIndex] ?? ""} 
            alt={anuncio?.titulo} 
            className="fullscreenImage" 
            onClick={(e) => e.stopPropagation()} 
          />
          
          {anuncio.imagens?.length > 1 && (
            <button className="fullscreenArrow right" onClick={irParaProximaImagem}>
              <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            </button>
          )}
          
          {anuncio.imagens?.length > 1 && (
            <div className="fullscreenIndicator">
              {imagemAtivaIndex + 1} / {anuncio.imagens.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnuncioDetalhe;
