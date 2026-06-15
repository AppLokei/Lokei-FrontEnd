import { Link } from "react-router-dom";
import Botao from "./Button";
import "./RentalCard.css";

const configuracaoStatus = {
  concluido: { rotulo: "Concluído", semantica: "success" },
  aprovado: { rotulo: "Aprovado", semantica: "success" },
  confirmado: { rotulo: "Confirmado", semantica: "success" },
  analise: { rotulo: "Em Análise", semantica: "warning" },
  em_aprovacao: { rotulo: "Em Análise", semantica: "warning" },
  andamento: { rotulo: "Em Andamento", semantica: "warning" },
  em_andamento: { rotulo: "Em Andamento", semantica: "warning" },
  pausado: { rotulo: "Pausado", semantica: "neutral" },
  cancelado: { rotulo: "Cancelado", semantica: "neutral" },
  reprovado: { rotulo: "Reprovado", semantica: "neutral" },
};

const CardAluguel = ({
  imagem,
  titulo,
  periodo,
  status,
  acao,
  acoesLocador,
  hrefAnuncio,
}) => {
  const configuracao = configuracaoStatus[status] || {
    rotulo: status,
    semantica: "neutral",
  };

  return (
    <article className="rentalCard">
      {hrefAnuncio ? (
        <Link to={hrefAnuncio} className="rentalCardImageLink">
          <div
            className="rentalCardImage"
            style={imagem ? { backgroundImage: `url(${imagem})` } : undefined}
          />
        </Link>
      ) : (
        <div
          className="rentalCardImage"
          style={imagem ? { backgroundImage: `url(${imagem})` } : undefined}
        />
      )}
      <div className="rentalCardBody">
        <div className="rentalCardInfo">
          {hrefAnuncio ? (
            <Link to={hrefAnuncio} style={{ textDecoration: "none", color: "inherit" }}>
              <h3 className="rentalCardTitle">{titulo}</h3>
            </Link>
          ) : (
            <h3 className="rentalCardTitle">{titulo}</h3>
          )}
          <p className="rentalCardPeriod">{periodo}</p>
        </div>
        <div className={`rentalCardBadge rentalCardBadge--${configuracao.semantica}`}>
          {configuracao.rotulo}
        </div>
        {acao ? (
          <div className="rentalCardActions">
            <Botao type="button" variante={acao.variante} onClick={acao.aoClicar}>
              {acao.rotulo}
            </Botao>
          </div>
        ) : null}
        {acoesLocador ? (
          <div className="rentalCardActions">
            {acoesLocador.map((acaoLocador) => (
              <Botao
                key={acaoLocador.rotulo}
                type="button"
                variante={acaoLocador.variante}
                onClick={acaoLocador.aoClicar}
              >
                {acaoLocador.rotulo}
              </Botao>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
};

export default CardAluguel;
