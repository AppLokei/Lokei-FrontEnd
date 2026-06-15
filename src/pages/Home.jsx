import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import CampoEntrada from "../components/Input";
import Botao from "../components/Button";
import CardFerramenta from "../components/ToolCard";
import BarraNavegacao from "../components/NavigationBar";
import { listarAnuncios, mapearAnuncioParaCard } from "../services";
import "./Home.css";


const categorias = [
  { id: "FURADEIRAS_E_PARAFUSADEIRAS", nome: "Furadeiras", icon: "⚡" },
  { id: "LIXADEIRAS", nome: "Lixadeiras", icon: "🛠️" },
  { id: "SERRAS_E_MOTOSSERRAS", nome: "Serras", icon: "🪚" },
  { id: "MARTELOS", nome: "Martelos", icon: "🔨" },
];

const Home = () => {
  const navigate = useNavigate();
  const [ferramentas, setFerramentas] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  /* ── Notificações ── */
  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const notificacoesRef = useRef(null);
  
  const userId = localStorage.getItem("lokei_user_id") || "1";

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem(`lokei_notificacoes_${userId}`) || "[]");
    setNotificacoes(list);
  }, [userId]);

  const notificacoesNaoLidas = notificacoes.filter((n) => !n.lido && n.tipo !== "message").length;

  const handleToggleNotificacoes = () => {
    const novaAberta = !notificacoesAbertas;
    setNotificacoesAbertas(novaAberta);
    if (novaAberta && notificacoes.some((n) => !n.lido && n.tipo !== "message")) {
      const atualizadas = notificacoes.map((n) => (n.tipo !== "message" ? { ...n, lido: true } : n));
      setNotificacoes(atualizadas);
      localStorage.setItem(`lokei_notificacoes_${userId}`, JSON.stringify(atualizadas));
    }
  };

  /* ── Filtros ── */
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [categoria, setCategoria] = useState("");
  const [valorMin, setValorMin] = useState("");
  const [valorMax, setValorMax] = useState("");
  const [filtrosAtivos, setFiltrosAtivos] = useState({
    categoria: "",
    valorMin: "",
    valorMax: "",
  });

  /* Fecha dropdown ao clicar fora */
  useEffect(() => {
    const handleClickOutside = (evento) => {
      if (notificacoesRef.current && !notificacoesRef.current.contains(evento.target)) {
        setNotificacoesAbertas(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const carregar = async () => {
      try {
        setCarregando(true);
        const resposta = await listarAnuncios({
          pagina: 0,
          tamanho: 12,
          titulo: busca,
          categoria: filtrosAtivos.categoria,
          valorMin: filtrosAtivos.valorMin,
          valorMax: filtrosAtivos.valorMax,
        });
        const ativos = resposta.filter((a) => a.status === "ATIVO" || !a.status);
        setFerramentas(ativos.map(mapearAnuncioParaCard));
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    };

    const timeoutId = setTimeout(() => {
      carregar();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [busca, filtrosAtivos]);

  const handleAplicarFiltros = () => {
    setFiltrosAtivos({ categoria, valorMin, valorMax });
    setFiltrosAbertos(false);
  };

  const handleLimparFiltros = () => {
    setCategoria("");
    setValorMin("");
    setValorMax("");
    setFiltrosAtivos({ categoria: "", valorMin: "", valorMax: "" });
  };

  /* ── Filtragem dos cards ── */
  const itensFiltrados = ferramentas;

  return (
    <div className="homePage">
      <div className="homeContent">
        <section className="homeHero">
          <h1>Equipamentos ideais, perto de você.</h1>
          <p>Alugue o que precisa. Empreste o que não usa. Economize sempre.</p>
        </section>

        <header className="homeSearchHeader">
          <div className="homeSearchField" style={{ display: "flex", flex: 1 }}>
            <CampoEntrada
              rotulo="Buscar"
              placeholder="Buscar ferramentas..."
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
              acao={
                <button type="button" style={{ border: "none", background: "var(--color-amarelo-acao)", width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--color-grafite-escuro)" }}>
                  <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" style={{ fill: "none", stroke: "currentColor", strokeWidth: 2 }}>
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              }
            />
          </div>
          <div className="homeSearchActions">
            <div className="homeNotifWrapper" ref={notificacoesRef}>
              <button
                className="homeIconButton"
                type="button"
                aria-label="Notificacoes"
                onClick={handleToggleNotificacoes}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3a5 5 0 0 0-5 5v3.2l-1.5 2.6A1 1 0 0 0 6.4 15h11.2a1 1 0 0 0 .9-1.2L17 11.2V8a5 5 0 0 0-5-5zm0 18a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2z" />
                </svg>
                {notificacoesNaoLidas > 0 ? (
                  <span className="homeNotifBadge">{notificacoesNaoLidas}</span>
                ) : null}
              </button>

              {notificacoesAbertas ? (
                <>
                  <div className="homeNotifOverlayMobile" onClick={() => setNotificacoesAbertas(false)}></div>
                  <div className="homeNotifDropdown">
                    <div className="homeNotifHeader" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong>Notificacoes</strong>
                      <span style={{ marginLeft: "5px" }}>{notificacoes.length} total</span>
                    </div>
                    {notificacoes.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem(`lokei_notificacoes_${userId}`, "[]");
                          setNotificacoes([]);
                        }}
                        style={{ background: "none", border: "none", color: "var(--color-primary, #e6b121)", cursor: "pointer", fontSize: "0.8rem", fontWeight: "bold" }}
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                  <ul className="homeNotifList">
                    {notificacoes.filter(n => n.tipo !== "message").length > 0 ? (
                      notificacoes.filter(n => n.tipo !== "message").map((notificacao) => (
                        <li key={notificacao.id} className="homeNotifItem">
                          <span className={`homeNotifIcon homeNotifIcon--${notificacao.tipo}`}>
                            {notificacao.tipo === "success" && (
                              <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            )}
                            {notificacao.tipo === "alert" && (
                              <svg viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M10.3 3.2 1.8 18a2 2 0 0 0 1.7 3h16.9a2 2 0 0 0 1.7-3L13.7 3.2a2 2 0 0 0-3.4 0z" /></svg>
                            )}
                          </span>
                          <div className="homeNotifText">
                            <p>{notificacao.texto}</p>
                            <span>{notificacao.hora}</span>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="homeNotifItem" style={{ justifyContent: "center", padding: "15px", color: "gray" }}>
                        Nenhuma nova notificação
                      </li>
                    )}
                  </ul>
                  
                  </div>
                </>
              ) : null}
            </div>
            <button
              className="homeFilterTrigger"
              type="button"
              onClick={() => setFiltrosAbertos(true)}
            >
              Filtrar
            </button>
          </div>
        </header>

        <section className="homeCategories">
          <div className="homeSectionHeader">
            <h2 className="homeSectionTitle">Categorias</h2>
            <Link className="homeSectionLink" to="/anuncios">
              Ver todos
            </Link>
          </div>
          <div className="homeCategoryRow">
            {categorias.map((item) => (
              <button
                key={item.id}
                className={`homeCategoryCard${categoria === item.id ? " is-active" : ""}`}
                type="button"
                onClick={() => {
                  const novaCat = categoria === item.id ? "" : item.id;
                  setCategoria(novaCat);
                  setFiltrosAtivos((prev) => ({ ...prev, categoria: novaCat }));
                }}
              >
                <span className="homeCategoryIcon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="homeCategoryLabel">{item.nome}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="homeSection">
          <div className="homeSectionHeader">
            <h2 className="homeSectionTitle">Novidades</h2>
            <Link className="homeSectionLink" to="/anuncios">
              Ver todos
            </Link>
          </div>
          <div className="homeGrid">
            {carregando ? <p className="homeEmpty">Carregando anuncios...</p> : null}
            {erro ? <p className="homeEmpty">{erro}</p> : null}
            {!carregando && !erro && itensFiltrados.length > 0 ? (
              itensFiltrados.map((ferramenta) => (
                <CardFerramenta
                  key={ferramenta.id}
                  titulo={ferramenta.titulo}
                  local={ferramenta.localizacao}
                  preco={ferramenta.preco}
                  valorDiario={ferramenta.valorDiario}
                  imagem={ferramenta.imagem}
                  hrefCta={`/anuncios/${ferramenta.id}`}
                />
              ))
            ) : (
              <p className="homeEmpty">
                Nenhuma ferramenta encontrada com esses filtros.
              </p>
            )}
          </div>
        </section>

        <section className="homeSection">
          <div className="homeSectionHeader">
            <h2 className="homeSectionTitle">Promocoes</h2>
            <Link className="homeSectionLink" to="/anuncios">
              Ver todos
            </Link>
          </div>
          <div className="homeGrid">
            {!carregando && !erro && itensFiltrados.length > 0 ? (
              itensFiltrados.map((ferramenta) => (
                <CardFerramenta
                  key={`promo-${ferramenta.id}`}
                  titulo={ferramenta.titulo}
                  local={ferramenta.localizacao}
                  preco={ferramenta.preco}
                  valorDiario={ferramenta.valorDiario}
                  imagem={ferramenta.imagem}
                  hrefCta={`/anuncios/${ferramenta.id}`}
                />
              ))
            ) : (
              <p className="homeEmpty">
                Nenhuma ferramenta encontrada com esses filtros.
              </p>
            )}
          </div>
        </section>
      </div>

      {/* ── Modal de Filtros ── */}
      {filtrosAbertos ? (
        <div className="homeFilterOverlay" onClick={() => setFiltrosAbertos(false)}>
          <div
            className="homeFilterModal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Filtros"
          >
            <header className="homeFilterHeader">
              <h2>Filtros</h2>
              <button
                className="homeFilterClose"
                type="button"
                onClick={() => setFiltrosAbertos(false)}
                aria-label="Fechar"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            <div className="homeFilterBody">
              <label className="homeFilterField">
                <span className="homeFilterLabel">Categoria</span>
                <select
                  className="homeFilterSelect"
                  value={categoria}
                  onChange={(evento) => setCategoria(evento.target.value)}
                >
                  <option value="">Todas</option>
                  <option value="FURADEIRAS_E_PARAFUSADEIRAS">Furadeiras e Parafusadeiras</option>
                  <option value="LIXADEIRAS">Lixadeiras</option>
                  <option value="SERRAS_E_MOTOSSERRAS">Serras e Motosserras</option>
                  <option value="MARTELOS">Marteletes e Martelos</option>
                  <option value="OUTROS">Outros</option>
                </select>
              </label>

              <div className="homeFilterField">
                <span className="homeFilterLabel">Faixa de Valor Diario (R$)</span>
                <div className="homeFilterRange">
                  <input
                    className="homeFilterInput"
                    type="number"
                    placeholder="Min"
                    min="0"
                    value={valorMin}
                    onChange={(evento) => setValorMin(evento.target.value)}
                  />
                  <span className="homeFilterRangeSep">ate</span>
                  <input
                    className="homeFilterInput"
                    type="number"
                    placeholder="Max"
                    min="0"
                    value={valorMax}
                    onChange={(evento) => setValorMax(evento.target.value)}
                  />
                </div>
              </div>
            </div>

            <footer className="homeFilterFooter">
              <button
                className="homeFilterClear"
                type="button"
                onClick={handleLimparFiltros}
              >
                Limpar Filtros
              </button>
              <Botao type="button" onClick={handleAplicarFiltros}>
                Aplicar Filtros
              </Botao>
            </footer>
          </div>
        </div>
      ) : null}

      <BarraNavegacao />
    </div>
  );
};

export default Home;
