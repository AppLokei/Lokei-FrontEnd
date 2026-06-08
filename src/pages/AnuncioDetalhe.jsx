import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CampoEntrada from "../components/Input";
import Botao from "../components/Button";
import BarraNavegacao from "../components/NavigationBar";
import { buscarAnuncioPorId, formatarMoeda } from "../apiServices";
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
  const [souLocador] = useState(false);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [erros, setErros] = useState({});
  const [anuncio, setAnuncio] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

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
    const carregar = async () => {
      try {
        setCarregando(true);
        setErro("");
        const resposta = await buscarAnuncioPorId(id);
        setAnuncio(resposta);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    };

    carregar();
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

    return proximosErros;
  };

  const handleSubmit = () => {
    if (souLocador) return;
    const proximosErros = validar();
    setErros(proximosErros);
    if (Object.keys(proximosErros).length > 0) return;

    console.log({ anuncioId: id, dataInicio, dataFim });
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
              <div className="detailMedia">
                <img
                  src={anuncio.imagens?.[0] ?? ""}
                  alt={anuncio.titulo}
                  className="detailImage"
                />
              </div>

              <div className="detailHeader">
                <h1 className="detailTitle">{anuncio.titulo}</h1>
                <p className="detailLocation">Local nao informado</p>
              </div>

              <div className="detailSection">
                <h2>Descricao</h2>
                <p>{anuncio.descricao}</p>
              </div>

              <div className="detailSection detailOwner">
                <div>
                  <h2>Locador</h2>
                  <p>Usuario do anuncio</p>
                </div>
                <div className="detailOwnerRating">
                  <span>4.8 ★</span>
                  <span>0 avaliacoes</span>
                </div>
              </div>

              <div className="detailSection">
                <h2>Avaliacoes</h2>
                <div className="detailReviews">
                  <p>
                    As avaliacoes serao integradas depois que o backend expuser a
                    listagem.
                  </p>
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

                {!souLocador ? (
                  <div className="detailSection">
                    <h2>Selecione o periodo</h2>
                    <p className="detailPolicy">Limite de 30 dias</p>
                    <div className="detailDates">
                      <CampoEntrada
                        rotulo="Data de inicio"
                        type="date"
                        value={dataInicio}
                        min={valorHoje}
                        onChange={(evento) => setDataInicio(evento.target.value)}
                        erro={erros.dataInicio}
                      />
                      <CampoEntrada
                        rotulo="Data de fim"
                        type="date"
                        value={dataFim}
                        min={dataInicio || valorHoje}
                        onChange={(evento) => setDataFim(evento.target.value)}
                        erro={erros.dataFim}
                      />
                    </div>
                    {resumoSelecao ? (
                      <div className="detailSummary">{resumoSelecao}</div>
                    ) : null}
                    <Botao type="button" onClick={handleSubmit}>
                      Solicitar Aluguel
                    </Botao>
                    <button
                      className="detailChatLink"
                      type="button"
                      onClick={() => navigate("/chat")}
                    >
                      Abrir Chat
                    </button>
                  </div>
                ) : (
                  <div className="detailSection">
                    <Botao type="button" onClick={() => navigate("/editar-anuncio")}>
                      Editar anuncio
                    </Botao>
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
    </div>
  );
};

export default AnuncioDetalhe;
