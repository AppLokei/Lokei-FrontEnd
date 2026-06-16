import { request } from "./http";

export const listarNotificacoes = async () => {
  return request("/notificacoes").catch(() => []);
};

export const marcarNotificacaoLida = async (id) => {
  return request(`/notificacoes/${id}/lida`, { method: "PATCH" });
};
