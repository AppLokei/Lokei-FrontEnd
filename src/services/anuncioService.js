import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

export async function criarAnuncio({
  titulo,
  descricao,
  valor,
  categoria,
  fotos,
}) {
  const anuncio = {
    titulo,
    descricao,
    valorDiario: Number(valor.replace(",", ".")),
    ferramenta: {
      nome: titulo,
      categoria,
    },
  };

  const formData = new FormData();

  formData.append(
    "anuncio",
    new Blob([JSON.stringify(anuncio)], { type: "application/json" }),
  );

  fotos.forEach((foto) => {
    formData.append("imagens", foto);
  });

  const response = await fetch("http://localhost:8080/anuncio", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Erro ao criar anúncio");
  }

  return response.json();
}
