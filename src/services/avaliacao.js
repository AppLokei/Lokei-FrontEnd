import { request } from "./http";

export const enviarAvaliacao = async ({ nota, comentario, aluguelId }) =>
  request("/avaliacoes/anuncios", {
    method: "POST",
    body: JSON.stringify({ nota, comentario, aluguelId }),
  });

export const avaliarPerfil = async ({ nota, comentario, avaliadoId, aluguelId }) =>
  request("/avaliacoes/perfis", {
    method: "POST",
    body: JSON.stringify({ nota, comentario, avaliadoId, aluguelId }),
  });
