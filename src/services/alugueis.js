import { request } from "./http";

export const buscarAlugueisPorUsuario = async (identificador, pagina = 0, tamanho = 12) => {
  const data = await request(`/alugueis-por-usuario?identificador=${identificador}&pagina=${pagina}&tamanho=${tamanho}`);
  return data.content || [];
};

export const criarAluguel = async (dados) => {
  const data = await request("/alugueis", {
    method: "POST",
    body: JSON.stringify(dados),
  });
  return data;
};

export const atualizarStatusAluguel = async (id, status) => {
  const data = await request(`/alugueis/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return data;
};
