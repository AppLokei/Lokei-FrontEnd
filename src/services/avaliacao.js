import { request } from "./http";

export const enviarAvaliacao = async ({ nota, comentario, aluguelId = 1 }) =>
  request("/avaliacao", {
    method: "POST",
    body: JSON.stringify({
      nota,
      comentario,
      dataCriacao: new Date().toISOString(),
      aluguelEntity: { id: aluguelId },
    }),
  });
