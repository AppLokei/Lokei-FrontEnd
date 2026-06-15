import { request } from "./http";

export const CATEGORIAS = {
  ELETRICAS: "Ferramentas Eletricas",
  MANUAIS: "Ferramentas Manuais",
  JARDINAGEM: "Jardinagem",
  PINTURA: "Pintura",
  FURADEIRAS_E_PARAFUSADEIRAS: "Furadeiras e Parafusadeiras",
  LIXADEIRAS: "Lixadeiras",
  SERRAS_E_MOTOSSERRAS: "Serras e Motosserras",
  MARTELOS: "Marteletes e Martelos",
  OUTROS: "Outros",
};

const categoriaPorTitulo = (titulo = "", categoria = "") => {
  const normalizadoTitulo = titulo.toLowerCase();
  const normalizadoCategoria = categoria.toLowerCase();

  if (normalizadoCategoria.includes("eletric")) return "ELETRICAS";
  if (normalizadoCategoria.includes("manual")) return "MANUAIS";
  if (normalizadoCategoria.includes("jardin")) return "JARDINAGEM";
  if (normalizadoCategoria.includes("pint")) return "PINTURA";

  if (normalizadoTitulo.includes("furade") || normalizadoTitulo.includes("parafus")) {
    return "FURADEIRAS_E_PARAFUSADEIRAS";
  }
  if (normalizadoTitulo.includes("lix")) return "LIXADEIRAS";
  if (normalizadoTitulo.includes("serra")) return "SERRAS_E_MOTOSSERRAS";
  if (normalizadoTitulo.includes("martelo")) return "MARTELOS";
  return "OUTROS";
};

export const formatarMoeda = (valor) => {
  const numero = Number(valor ?? 0);
  return `R$ ${numero.toFixed(2)}`.replace(".", ",");
};

export const mapearAnuncioParaCard = (anuncio) => ({
  id: anuncio.id,
  titulo: anuncio.titulo,
  localizacao: "Local nao informado",
  preco: `${formatarMoeda(anuncio.valorDiario)}/dia`,
  valorDiario: Number(anuncio.valorDiario ?? 0),
  categoria: anuncio.ferramenta?.categoria || categoriaPorTitulo(anuncio.titulo, ""),
  imagem: anuncio.imagens?.[0] ?? "",
});

export const listarAnuncios = async (filtros = {}) => {
  const params = new URLSearchParams();

  Object.entries(filtros).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== null && `${valor}`.trim() !== "") {
      params.set(chave, valor);
    }
  });

  const query = params.toString();
  const data = await request(`/anuncios${query ? `?${query}` : ""}`);
  return Array.isArray(data?.content) ? data.content : [];
};

export const buscarAnuncioPorId = async (id, usuarioId) => {
  const params = new URLSearchParams();
  if (usuarioId !== undefined && usuarioId !== null && `${usuarioId}`.trim() !== "") {
    params.set("usuarioId", usuarioId);
  }
  const query = params.toString();
  return request(`/anuncios/${id}${query ? `?${query}` : ""}`);
};

export const consultarDisponibilidade = async (id) =>
  request(`/anuncios/${id}/disponibilidade`);

export const solicitarAluguel = async (id, { usuarioId, dataInicio, dataFim }) =>
  request(`/anuncios/${id}/reservas`, {
    method: "POST",
    body: JSON.stringify({ usuarioId, dataInicio, dataFim }),
  });

const criarPayloadAnuncio = ({ titulo, descricao, valorDiario, categoria }) => ({
  titulo,
  descricao,
  valorDiario: Number(valorDiario),
  ferramenta: {
    nome: titulo,
    categoria,
  },
});

export const criarAnuncio = async ({ titulo, descricao, valorDiario, categoria, imagens }) => {
  const formData = new FormData();
  formData.append(
    "anuncio",
    new Blob([JSON.stringify(criarPayloadAnuncio({ titulo, descricao, valorDiario, categoria }))], {
      type: "application/json",
    })
  );

  imagens.forEach((arquivo) => {
    formData.append("imagens", arquivo);
  });

  return request("/anuncio", {
    method: "POST",
    body: formData,
  });
};

export const atualizarAnuncio = async (id, { titulo, descricao, valorDiario, categoria }) =>
  request(`/anuncio/${id}`, {
    method: "PUT",
    body: JSON.stringify(
      criarPayloadAnuncio({ titulo, descricao, valorDiario, categoria })
    ),
  });

export const desativarAnuncio = async (id) =>
  request(`/anuncio/${id}`, { method: "DELETE" });

export const pausarAnuncio = async (id) =>
  request(`/anuncio/${id}/pausar`, { method: "PATCH" });

export const reativarAnuncio = async (id) =>
  request(`/anuncio/${id}/reativar`, { method: "PATCH" });

export const adicionarImagemAoAnuncio = async (id, arquivo) => {
  const formData = new FormData();
  formData.append("file", arquivo);

  return request(`/anuncio/${id}/imagem`, {
    method: "POST",
    body: formData,
  });
};

export const removerImagemDoAnuncio = async (anuncioId, imagemId) =>
  request(`/anuncio/${anuncioId}/imagens/${imagemId}`, {
    method: "DELETE",
  });

export const buscarAlugueisPorUsuario = async (identificador, pagina = 0, tamanho = 100) => {
  const data = await request(`/alugueis-por-usuario?identificador=${identificador}&pagina=${pagina}&tamanho=${tamanho}`);
  return Array.isArray(data?.content) ? data.content : [];
};

export { categoriaPorTitulo };
