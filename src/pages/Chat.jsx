import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

import BarraNavegacao from "../components/NavigationBar";
import ModalDenuncia from "../components/DenunciaModal";
import {
  listarChats,
  listarMensagens,
  enviarMensagem,
  buscarAnuncioPorId,
  excluirChat
} from "../services";
import ConfirmationModal from "../components/ConfirmationModal";
import "./Chat.css";

const formatTime = (isoString) => {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
};

const getNomeUsuario = (id) => {
  if (id === 2) return "Outro Teste";
  if (id === 3) return "Administrador";
  return "Usuário Teste";
};

const Chat = () => {
  const location = useLocation();
  const usuarioId = Number(localStorage.getItem("lokei_user_id") || 1);

  const [chats, setChats] = useState([]);
  const [conversaAtivaId, setConversaAtivaId] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [mensagemRascunho, setMensagemRascunho] = useState("");
  const [denunciaAberta, setDenunciaAberta] = useState(false);
  const [carregandoChats, setCarregandoChats] = useState(true);
  const [carregandoMensagens, setCarregandoMensagens] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const mensagensFimRef = useRef(null);

  const handleExcluirChat = async () => {
    if (!conversaAtivaId) return;
    try {
      await excluirChat(conversaAtivaId);
      setChats((prev) => prev.filter((c) => c.id !== conversaAtivaId));
      setConversaAtivaId(null);
      setModalExcluirAberto(false);
    } catch (err) {
      alert(`Erro ao excluir chat: ${err.message}`);
    }
  };

  const conversaAtiva = chats.find((c) => c.id === conversaAtivaId);

  useEffect(() => {
    const carregarTodosChats = async () => {
      try {
        setCarregandoChats(true);
        const listaChats = await listarChats(usuarioId);
        
        const chatsComNomes = await Promise.all(listaChats.map(async (c) => {
          let anuncio;
          try {
            anuncio = await buscarAnuncioPorId(c.anuncioId);
          } catch (err) {
            anuncio = null;
          }

          const outroUserId = c.locatarioId === usuarioId ? c.locadorId : c.locatarioId;
          let outroNome = `Usuário #${outroUserId}`;
          try {
            const uRes = await fetch(`/api/usuario/${outroUserId}`);
            if (uRes.ok) {
              const uData = await uRes.json();
              outroNome = uData.nome;
            }
          } catch (e) {}

          return {
            ...c,
            ferramenta: anuncio?.titulo || `Anúncio #${c.anuncioId}`,
            imagemFerramenta: anuncio?.imagens?.[0] || "https://images.unsplash.com/photo-1586864387789-628af9feed72?auto=format&fit=crop&w=200&q=60",
            nome: outroNome,
          };
        }));
        
        setChats(chatsComNomes);

        // Determine which chat is active initially
        const targetId = location.state?.activeChatId || (chatsComNomes.length > 0 ? chatsComNomes[0].id : null);
        if (targetId) {
          setConversaAtivaId(targetId);
        }
      } catch (err) {
        console.error("Erro ao carregar chats:", err);
      } finally {
        setCarregandoChats(false);
      }
    };

    carregarTodosChats();
  }, [usuarioId, location.state]);

  useEffect(() => {
    if (!conversaAtivaId) return;

    const carregarMensagens = async () => {
      try {
        const listaMsgs = await listarMensagens(conversaAtivaId, usuarioId);
        setMensagens(listaMsgs);
      } catch (err) {
        console.error("Erro ao carregar mensagens:", err);
      }
    };

    carregarMensagens();
    
    // Setup a simple polling interval (every 3 seconds) to refresh messages dynamically
    const interval = setInterval(carregarMensagens, 3000);
    return () => clearInterval(interval);
  }, [conversaAtivaId, usuarioId]);

  useEffect(() => {
    mensagensFimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens.length]);

  const handleSend = async () => {
    const texto = mensagemRascunho.trim();
    if (!texto || !conversaAtivaId) return;

    try {
      const novaMsg = await enviarMensagem(conversaAtivaId, {
        remetenteId: usuarioId,
        conteudo: texto,
      });
      setMensagens((prev) => [...prev, novaMsg]);
      setMensagemRascunho("");

      // Simulate sending notification to the other user via localStorage
      const destinatarioId = conversaAtiva.locatarioId === usuarioId ? conversaAtiva.locadorId : conversaAtiva.locatarioId;
      const key = `lokei_notificacoes_${destinatarioId}`;
      const notifs = JSON.parse(localStorage.getItem(key) || "[]");
      notifs.push({
        id: Date.now(),
        tipo: "message",
        texto: `Nova mensagem de ${conversaAtiva.nome}`,
        lido: false,
        hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      });
      localStorage.setItem(key, JSON.stringify(notifs));

    } catch (err) {
      alert(`Erro ao enviar mensagem: ${err.message}`);
    }
  };

  const handleKeyDown = (evento) => {
    if (evento.key === "Enter" && !evento.shiftKey) {
      evento.preventDefault();
      handleSend();
    }
  };

  const selecionarConversa = (id) => {
    setConversaAtivaId(id);
    setSidebarAberta(false);
  };

  return (
    <div className="chatPage">
      <BarraNavegacao />

      <div className="chatLayout">
        {/* ── Sidebar: lista de conversas ── */}
        <aside className={`chatSidebar${sidebarAberta ? " chatSidebar--open" : ""}`}>
          <div className="chatSidebarHeader">
            <h2>Conversas</h2>
          </div>

          <div className="chatConversationList">
            {carregandoChats ? (
              <p style={{ padding: "20px", color: "var(--color-text-secondary)" }}>Carregando chats...</p>
            ) : chats.length === 0 ? (
              <p style={{ padding: "20px", color: "var(--color-text-secondary)" }}>Nenhuma conversa iniciada.</p>
            ) : (
              chats.map((conv) => (
                <button
                  key={conv.id}
                  type="button"
                  className={`chatConversationItem${conv.id === conversaAtivaId ? " chatConversationItem--active" : ""}`}
                  onClick={() => selecionarConversa(conv.id)}
                >
                  <img
                    src={conv.imagemFerramenta}
                    alt={conv.ferramenta}
                    className="chatConversationImage"
                  />
                  <div className="chatConversationInfo">
                    <div className="chatConversationTop">
                      <strong className="chatConversationName">{conv.nome}</strong>
                    </div>
                    <span className="chatConversationTool">{conv.ferramenta}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Overlay mobile para fechar sidebar */}
        {sidebarAberta ? (
          <div
            className="chatSidebarOverlay"
            onClick={() => setSidebarAberta(false)}
          />
        ) : null}

        {/* ── Area principal: conversa ativa ── */}
        <main className="chatMain">
          {/* Header da conversa */}
          <header className="chatConvHeader">
            <button
              type="button"
              className="chatMenuBtn"
              onClick={() => setSidebarAberta(true)}
              aria-label="Abrir conversas"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            {conversaAtiva ? (
              <div className="chatConvHeaderInfo">
                <img
                  src={conversaAtiva.imagemFerramenta}
                  alt={conversaAtiva.ferramenta}
                  className="chatConvHeaderImage"
                />
                <div>
                  <strong>{conversaAtiva.nome}</strong>
                  <span>{conversaAtiva.ferramenta}</span>
                  <em className="chatConvStatus">Em Andamento</em>
                </div>
              </div>
            ) : (
              <div className="chatConvHeaderInfo">
                <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>Selecione uma conversa para iniciar</p>
              </div>
            )}

            {conversaAtiva ? (
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="chatReportBtn"
                  style={{ color: "var(--color-danger, #d9534f)" }}
                  onClick={() => setModalExcluirAberto(true)}
                  aria-label="Excluir"
                  title="Excluir conversa"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  className="chatReportBtn"
                  onClick={() => setDenunciaAberta(true)}
                  aria-label="Denunciar"
                  title="Denunciar"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </button>
              </div>
            ) : null}
          </header>

          {/* Mensagens */}
          <div className="chatMessages">
            {conversaAtivaId ? (
              mensagens.length === 0 ? (
                <p style={{ textAlign: "center", padding: "40px", color: "var(--color-text-secondary)" }}>
                  Envie uma mensagem para iniciar a conversa!
                </p>
              ) : (
                mensagens.map((msg) => (
                  <div
                    key={msg.id}
                    className={`chatBubble chatBubble--${msg.remetenteId === usuarioId ? "sent" : "received"}`}
                  >
                    <p>{msg.conteudo}</p>
                    <span className="chatBubbleTime">{formatTime(msg.dataHoraEnvio)}</span>
                  </div>
                ))
              )
            ) : (
              <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px", color: "var(--color-text-secondary)" }}>
                <svg viewBox="0 0 24 24" style={{ width: "64px", height: "64px", opacity: 0.5 }}>
                  <path d="M4 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H9l-5 4v-4a3 3 0 0 1-3-3z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                <p>Nenhuma conversa selecionada</p>
              </div>
            )}
            <div ref={mensagensFimRef} />
          </div>

          {/* Input de mensagem */}
          <footer className="chatInputBar">
            <div className="chatInputBarInner">
              <input
                type="text"
                className="chatInput"
                placeholder="Digite uma mensagem..."
                value={mensagemRascunho}
                onChange={(evento) => setMensagemRascunho(evento.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!conversaAtivaId}
              />
              <button
                type="button"
                className="chatSendBtn"
                onClick={handleSend}
                disabled={!mensagemRascunho.trim() || !conversaAtivaId}
                aria-label="Enviar mensagem"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" />
                </svg>
              </button>
            </div>
          </footer>
        </main>
      </div>

      {conversaAtiva ? (
        <ModalDenuncia
          aberto={denunciaAberta}
          aoFechar={() => setDenunciaAberta(false)}
          anuncioId={conversaAtiva.anuncioId}
        />
      ) : null}

      <ConfirmationModal
        aberto={modalExcluirAberto}
        aoFechar={() => setModalExcluirAberto(false)}
        aoConfirmar={handleExcluirChat}
        titulo="Excluir Conversa"
        descricao={<p>Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita e a conversa será apagada para ambos os usuários.</p>}
        textoConfirmar="Excluir"
        varianteConfirmar="outlineRed"
      />
    </div>
  );
};

export default Chat;
