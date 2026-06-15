import { request } from "./http";

export const atualizarStatusAluguel = async (id, status) =>
  request(`/alugueis/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
