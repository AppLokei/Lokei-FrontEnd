import { request } from "./http";

export const criarDenuncia = async (anuncioId, { denuncianteId, motivo, descricao }) =>
  request(`/anuncios/${anuncioId}/denuncias`, {
    method: "POST",
    body: JSON.stringify({
      denuncianteId,
      motivo,
      descricao,
    }),
  });

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
