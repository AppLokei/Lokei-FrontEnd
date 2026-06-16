import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

import "./NavigationBar.css";

const BarraNavegacao = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("lokei_user_id");
  const role = localStorage.getItem("lokei_role");
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);
  const [chatNaoLidas, setChatNaoLidas] = useState(0);
  const [notifAberta, setNotifAberta] = useState(false);
  const [todasNotifs, setTodasNotifs] = useState([]);

  useEffect(() => {
    if (!userId) return;
    const checkNotifs = async () => {
      try {
        const { listarNotificacoes } = await import("../services/notificacoes");
        const notifs = await listarNotificacoes();
        setTodasNotifs(notifs);
        
        const numSys = notifs.filter((n) => !n.lida && n.tipo !== "message").length;
        setNotificacoesNaoLidas(numSys);

        const numChat = notifs.filter((n) => !n.lida && n.tipo === "message").length;
        setChatNaoLidas(numChat);
      } catch (err) {
        console.error("Erro ao carregar notificacoes nav:", err);
      }
    };

    checkNotifs();
    const interval = setInterval(checkNotifs, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navigationBar">
      <div className="navContainer">
        <NavLink className="navBrand" to="/">
          <img className="navBrandLogo" src="/logo.png" alt="Lokei Logo" />
        </NavLink>

        <div className="navLinks">
          {userId ? (
            <>
              {role === "ADMIN" || role === "admin" ? (
                <>
                  <NavLink className="navItem" to="/admin">
                    <span className="navIcon">🛡️</span>
                    <span className="navLabel">Painel Admin</span>
                  </NavLink>
                  <NavLink className="navItem" to="/" end>
                    <span className="navIcon">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M4 10.5 12 4l8 6.5v8a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
                      </svg>
                    </span>
                    <span className="navLabel">Inicio</span>
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink className="navItem" to="/" end>
                    <span className="navIcon">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M4 10.5 12 4l8 6.5v8a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
                      </svg>
                    </span>
                    <span className="navLabel">Inicio</span>
                  </NavLink>
                  <NavLink className="navItem" to="/meus-alugueis">
                    <span className="navIcon">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7 4h10a2 2 0 0 1 2 2v13a1 1 0 0 1-1.6.8L12 16.2 6.6 19.8A1 1 0 0 1 5 19V6a2 2 0 0 1 2-2z" />
                      </svg>
                    </span>
                    <span className="navLabel">Meus Alugueis</span>
                  </NavLink>
                  <NavLink className="navItem navItem--primary" to="/anunciar">
                    <span className="navIcon">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 5v14m-7-7h14" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                    <span className="navLabel">Anunciar</span>
                  </NavLink>
                  <NavLink className="navItem" to="/chat" onClick={async () => {
                    try {
                      const { listarNotificacoes, marcarNotificacaoLida } = await import("../services/notificacoes");
                      const notifs = await listarNotificacoes();
                      const chatNotifs = notifs.filter(n => !n.lida && n.tipo === "message");
                      for (const n of chatNotifs) {
                        await marcarNotificacaoLida(n.id);
                      }
                      setChatNaoLidas(0);
                    } catch (e) {
                      console.error(e);
                    }
                  }}>
                    <span className="navIcon" style={{ position: "relative" }}>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M4 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H9l-5 4v-4a3 3 0 0 1-3-3z" />
                      </svg>
                      {chatNaoLidas > 0 && (
                        <span style={{
                          position: "absolute",
                          top: "-4px",
                          right: "-6px",
                          background: "red",
                          color: "white",
                          fontSize: "10px",
                          fontWeight: "bold",
                          borderRadius: "50%",
                          width: "16px",
                          height: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          {chatNaoLidas}
                        </span>
                      )}
                    </span>
                    <span className="navLabel">Chat</span>
                  </NavLink>
                </>
              )}
              <NavLink className="navItem" to="/perfil">
                <span className="navIcon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z" />
                  </svg>
                </span>
                <span className="navLabel">Perfil</span>
              </NavLink>
              <button className="navItem" onClick={handleLogout} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
                <span className="navIcon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                  </svg>
                </span>
                <span className="navLabel">Sair</span>
              </button>
            </>
          ) : (
            <>
              <NavLink className="navItem" to="/" end>
                <span className="navLabel">Inicio</span>
              </NavLink>
              <NavLink className="navItem" to="/login">
                <span className="navLabel">Entrar</span>
              </NavLink>
              <NavLink className="navItem navItem--primary" to="/cadastro">
                <span className="navLabel">Cadastrar</span>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default BarraNavegacao;
