import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

import "./NavigationBar.css";

const BarraNavegacao = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(localStorage.getItem("lokei_role") || "locatario");
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);
  const [chatNaoLidas, setChatNaoLidas] = useState(0);
  const [notifAberta, setNotifAberta] = useState(false);
  const [todasNotifs, setTodasNotifs] = useState([]);

  useEffect(() => {
    const checkNotifs = () => {
      const userId = localStorage.getItem("lokei_user_id") || "1";
      const notifs = JSON.parse(localStorage.getItem(`lokei_notificacoes_${userId}`) || "[]");
      setTodasNotifs(notifs);
      
      const numSys = notifs.filter((n) => !n.lido && n.tipo !== "message").length;
      setNotificacoesNaoLidas(numSys);

      const numChat = notifs.filter((n) => !n.lido && n.tipo === "message").length;
      setChatNaoLidas(numChat);
    };

    checkNotifs();
    const interval = setInterval(checkNotifs, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    localStorage.setItem("lokei_role", newRole);
    
    if (newRole === "locador") {
      localStorage.setItem("lokei_user_id", "2");
      localStorage.setItem("lokei_email", "outro@email.com");
      localStorage.setItem("lokei_nome", "Outro Teste");
      localStorage.setItem("lokei_telefone", "(64) 98888-8888");
      localStorage.setItem("lokei_cpf", "987.654.321-09");
    } else if (newRole === "locatario") {
      localStorage.setItem("lokei_user_id", "1");
      localStorage.setItem("lokei_email", "teste@email.com");
      localStorage.setItem("lokei_nome", "Usuário Teste");
      localStorage.setItem("lokei_telefone", "(64) 99999-9999");
      localStorage.setItem("lokei_cpf", "123.456.789-01");
    } else if (newRole === "admin") {
      localStorage.setItem("lokei_user_id", "3");
      localStorage.setItem("lokei_email", "admin@email.com");
      localStorage.setItem("lokei_nome", "Admin Teste");
      localStorage.setItem("lokei_telefone", "(64) 00000-0000");
      localStorage.setItem("lokei_cpf", "000.000.000-00");
    }

    if (newRole === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
    window.location.reload();
  };

  return (
    <nav className="navigationBar">
      <div className="navContainer">
        <NavLink className="navBrand" to="/">
          <img className="navBrandLogo" src="/logo.png" alt="Lokei Logo" />
        </NavLink>



        <div className="navLinks">
          {role === "admin" ? (
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
              <NavLink className="navItem" to="/chat" onClick={() => {
                const userId = localStorage.getItem("lokei_user_id") || "1";
                const key = `lokei_notificacoes_${userId}`;
                const notifs = JSON.parse(localStorage.getItem(key) || "[]");
                if (notifs.some(n => !n.lido && n.tipo === "message")) {
                  const updated = notifs.map(n => n.tipo === "message" ? { ...n, lido: true } : n);
                  localStorage.setItem(key, JSON.stringify(updated));
                  setChatNaoLidas(0);
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
        </div>
      </div>
    </nav>
  );
};

export default BarraNavegacao;
