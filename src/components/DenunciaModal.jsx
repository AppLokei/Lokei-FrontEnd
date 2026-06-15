import { useState } from "react";

import CampoEntrada from "./Input";
import Botao from "./Button";
import ConfirmationModal from "./ConfirmationModal";
import { criarDenuncia } from "../services";
import "./DenunciaModal.css";

const motivos = [
  { valor: "ANUNCIO_FALSO", texto: "Anúncio Falso / Golpe" },
  { valor: "DESACORDO_POLITICAS", texto: "Desacordo com as Políticas" },
  { valor: "DISCRIMINACAO", texto: "Discriminação / Ofensa" },
  { valor: "FERRAMENTA_DIFERENTE", texto: "Ferramenta Diferente do Anúncio" },
];

const ModalDenuncia = ({ aberto, aoFechar, anuncioId = 1 }) => {
  const [motivo, setMotivo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagens, setImagens] = useState([]);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [confirmarAberto, setConfirmarAberto] = useState(false);

  if (!aberto) return null;

  const handleImageChange = (evento) => {
    const arquivos = Array.from(evento.target.files || []);
    const restante = 5 - imagens.length;
    setImagens((prev) => [...prev, ...arquivos.slice(0, restante)]);
  };

  const removeImage = (index) => {
    setImagens((prev) => prev.filter((_, i) => i !== index));
  };

  const validar = () => {
    const proximosErros = {};
    if (!motivo) proximosErros.motivo = "Selecione um motivo.";
    if (!descricao.trim()) proximosErros.descricao = "Descreva o ocorrido.";
    return proximosErros;
  };

  const handleSubmit = () => {
    const proximosErros = validar();
    setErros(proximosErros);
    if (Object.keys(proximosErros).length > 0) return;

    setConfirmarAberto(true);
  };

  const realizarEnvio = async () => {
    try {
      setEnviando(true);
      const userLoggedId = Number(localStorage.getItem("lokei_user_id") || 1);
      await criarDenuncia(anuncioId, {
        denuncianteId: userLoggedId,
        motivo,
        descricao,
      });
      alert("Denúncia enviada com sucesso!");
      setMotivo("");
      setDescricao("");
      setImagens([]);
      setConfirmarAberto(false);
      aoFechar();
    } catch (error) {
      setErros({ submit: error.message });
      setConfirmarAberto(false);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="denunciaOverlay" onClick={aoFechar}>
      <div
        className="denunciaModal"
        onClick={(evento) => evento.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Fazer denuncia"
      >
        <header className="denunciaHeader">
          <h2>Fazer Denuncia</h2>
          <button
            className="denunciaClose"
            type="button"
            onClick={aoFechar}
            aria-label="Fechar"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M18 6 6 18M6 6l12 12"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className="denunciaBody">
          <label className="denunciaField">
            <span className="denunciaLabel">Motivo</span>
            <select
              className={`denunciaSelect${erros.motivo ? " denunciaSelect--error" : ""}`}
              value={motivo}
              onChange={(evento) => setMotivo(evento.target.value)}
            >
              <option value="">Selecione um motivo</option>
              {motivos.map((m) => (
                <option key={m.valor} value={m.valor}>
                  {m.texto}
                </option>
              ))}
            </select>
            {erros.motivo ? (
              <span className="denunciaError">{erros.motivo}</span>
            ) : null}
          </label>

          <CampoEntrada
            rotulo="Descricao"
            placeholder="Descreva o que aconteceu..."
            value={descricao}
            onChange={(evento) => setDescricao(evento.target.value)}
            erro={erros.descricao}
          />

          {/* Botão de imagens: ação secundária (cinza), NÃO vermelho */}
          <div className="denunciaImages">
            <span className="denunciaLabel">
              Imagens ({imagens.length}/5)
            </span>

            {imagens.length > 0 ? (
              <div className="denunciaImageList">
                {imagens.map((arquivo, index) => (
                  <div key={index} className="denunciaImageItem">
                    <span className="denunciaImageName">{arquivo.name}</span>
                    <button
                      type="button"
                      className="denunciaImageRemove"
                      onClick={() => removeImage(index)}
                      aria-label={`Remover ${arquivo.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            {imagens.length < 5 ? (
              <label className="denunciaAddImageBtn">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="denunciaAddImageIcon"
                >
                  <path
                    d="M12 5v14m-7-7h14"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Adicionar imagens
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  multiple
                  onChange={handleImageChange}
                  className="denunciaFileInput"
                />
              </label>
            ) : null}
          </div>
        </div>

        <footer className="denunciaFooter">
          {erros.submit && <span className="denunciaError" style={{ display: 'block', marginBottom: '10px' }}>{erros.submit}</span>}
          <Botao type="button" variante="secondary" onClick={aoFechar} disabled={enviando}>
            Cancelar
          </Botao>
          <Botao type="button" variante="primary" onClick={handleSubmit} disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar Denuncia"}
          </Botao>
        </footer>
      </div>

      <ConfirmationModal
        aberto={confirmarAberto}
        aoFechar={() => setConfirmarAberto(false)}
        aoConfirmar={realizarEnvio}
        titulo="Confirmar Denúncia"
        descricao="Tem certeza que deseja enviar esta denúncia? Nossos moderadores irão analisar o caso."
        textoConfirmar="Sim, Enviar"
        textoCancelar="Cancelar"
      />
    </div>
  );
};

export default ModalDenuncia;
