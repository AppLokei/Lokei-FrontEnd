import { request } from "./http";

export const criarDenuncia = async (anuncioId, { motivo, descricao }) =>
  request(`/anuncios/${anuncioId}/denuncias`, {
    method: "POST",
    body: JSON.stringify({ motivo, descricao }),
  });

// Admin endpoints (assuming backend handles these under /denuncias or /admin/denuncias)
export const listarDenuncias = async (status = "PENDENTE") =>
  request(`/denuncias?status=${status}`);

export const aprovarDenuncia = async (id) =>
  request(`/denuncias/${id}/aprovar`, {
    method: "PATCH",
  });

export const recusarDenuncia = async (id) =>
  request(`/denuncias/${id}/recusar`, {
    method: "PATCH",
  });
