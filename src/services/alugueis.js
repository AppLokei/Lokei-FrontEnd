import { request } from "./http";

export const buscarAlugueisPorUsuario = async () => {
  // O backend divide os alugueis em "meus" (locatario) e "recebidos" (locador)
  const meus = await request(`/alugueis/meus`).catch(() => []);
  const recebidos = await request(`/alugueis/recebidos`).catch(() => []);
  
  // Marca cada array com o papel correspondente para facilitar o mapeamento posterior
  const meusFormatados = meus.map(m => ({ ...m, papel: 'locatario' }));
  const recebidosFormatados = recebidos.map(r => ({ ...r, papel: 'locador' }));
  
  return [...meusFormatados, ...recebidosFormatados];
};

export const criarAluguel = async (dados) => {
  const data = await request(`/anuncios/${dados.anuncioId}/reservas`, {
    method: "POST",
    body: JSON.stringify(dados),
  });
  return data;
};

export const aprovarAluguel = async (id) => {
  const data = await request(`/alugueis/${id}/aprovar`, {
    method: "PATCH",
  });
  return data;
};

export const reprovarAluguel = async (id, motivo) => {
  const data = await request(`/alugueis/${id}/reprovar`, {
    method: "PATCH",
    body: JSON.stringify({ motivo }),
  });
  return data;
};

export const cancelarAluguel = async (id, motivo) => {
  const data = await request(`/alugueis/${id}/cancelar`, {
    method: "PATCH",
    body: JSON.stringify({ motivo }),
  });
  return data;
};

export const confirmarEntregaAluguel = async (id) => {
  const data = await request(`/alugueis/${id}/confirmar-entrega`, {
    method: "PATCH",
  });
  return data;
};

export const finalizarAluguel = async (id) => {
  const data = await request(`/alugueis/${id}/finalizar`, {
    method: "PATCH",
  });
  return data;
};
