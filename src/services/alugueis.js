import api from "./http";

export const buscarAlugueisPorUsuario = async (identificador, pagina = 0, tamanho = 12) => {
  const { data } = await api.get(`/alugueis-por-usuario?identificador=${identificador}&pagina=${pagina}&tamanho=${tamanho}`);
  return data.content || [];
};

export const criarAluguel = async (dados) => {
  const { data } = await api.post("/alugueis", dados);
  return data;
};

export const atualizarStatusAluguel = async (id, status) => {
  const { data } = await api.patch(`/alugueis/${id}/status`, { status });
  return data;
};
