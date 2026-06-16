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
  categoria: anuncio.categoria || categoriaPorTitulo(anuncio.titulo, ""),
  imagem: anuncio.imagemPrincipalUrl ?? anuncio.imagemPrincipal ?? "",
});

export const listarAnuncios = async (filtros = {}) => {
  const params = new URLSearchParams();

  // Map frontend filter names to backend expected parameters
  const apiParams = {
    q: filtros.titulo,
    categoria: filtros.categoria,
    precoMin: filtros.valorMin,
    precoMax: filtros.valorMax,
    cidade: filtros.cidade,
    page: filtros.pagina ?? 0,
    size: filtros.tamanho ?? 12,
    sort: filtros.ordem ?? "recente"
  };

  Object.entries(apiParams).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== null && `${valor}`.trim() !== "") {
      params.set(chave, valor);
    }
  });

  const query = params.toString();
  const data = await request(`/anuncios${query ? `?${query}` : ""}`);
  return Array.isArray(data?.itens) ? data.itens : [];
};

export const buscarAnuncioPorId = async (id) => {
  const data = await request(`/anuncios/${id}`);
  return data;
};

export const criarAnuncio = async ({ titulo, descricao, valorDiario, categoria, imagens }) => {
  let imagemIds = [];

  if (imagens && imagens.length > 0) {
    const formData = new FormData();
    imagens.forEach((arquivo) => {
      formData.append("files", arquivo);
    });

    const uploadResponse = await request("/arquivos/upload", {
      method: "POST",
      body: formData,
    });
    
    imagemIds = uploadResponse.map((img) => img.imagemId);
  }

  return request("/anuncios", {
    method: "POST",
    body: JSON.stringify({
      titulo,
      descricao,
      valorDiario: Number(valorDiario),
      categoria,
      imagemIds,
    }),
  });
};

export const atualizarAnuncio = async (id, { titulo, descricao, valorDiario, categoria, imagemIds }) =>
  request(`/anuncios/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      titulo,
      descricao,
      valorDiario: Number(valorDiario),
      categoria,
      imagemIds: imagemIds || [],
    }),
  });

export const desativarAnuncio = async (id) =>
  request(`/anuncios/${id}`, { method: "DELETE" });

export const pausarAnuncio = async (id) =>
  request(`/anuncios/${id}/pausar`, { method: "PATCH" });

export const reativarAnuncio = async (id) =>
  request(`/anuncios/${id}/reativar`, { method: "PATCH" });

export { categoriaPorTitulo };
