import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import CardFerramenta from "../components/ToolCard";
import BarraNavegacao from "../components/NavigationBar";
import { listarAnuncios, mapearAnuncioParaCard } from "../apiServices";
import "./Anuncios.css";
const Anuncios = () => {
  const [anuncios, setAnuncios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const carregar = async () => {
      try {
        setCarregando(true);
        setErro("");
        const resposta = await listarAnuncios({ pagina: 0, tamanho: 12 });
        setAnuncios(resposta.map(mapearAnuncioParaCard));
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, []);

  return (
    <div className="anunciosPage">
      <BarraNavegacao />
      <div className="anunciosContainer">
        <header className="anunciosHeader">
          <h1>Explorar anuncios</h1>
          <p>Encontre ferramentas disponiveis perto de voce.</p>
          <Link className="anunciosCta" to="/anunciar">
            Publicar anuncio
          </Link>
        </header>

        {carregando ? <p>Carregando anuncios...</p> : null}
        {erro ? <p>{erro}</p> : null}

        <div className="anunciosGrid">
          {anuncios.map((anuncio) => (
            <CardFerramenta
              key={anuncio.id}
              titulo={anuncio.titulo}
              local={anuncio.localizacao}
              preco={anuncio.preco}
              valorDiario={anuncio.valorDiario}
              imagem={anuncio.imagem}
              hrefCta={`/anuncios/${anuncio.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Anuncios;
