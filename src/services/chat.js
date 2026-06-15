import { request } from "./http";

export const iniciarChat = async (anuncioId, locatarioId) =>
  request(`/anuncios/${anuncioId}/chats?locatarioId=${locatarioId}`, {
    method: "POST",
  });

export const listarChats = async (usuarioId) =>
  request(`/chats?usuarioId=${usuarioId}`);

export const enviarMensagem = async (chatId, { remetenteId, conteudo }) =>
  request(`/chats/${chatId}/mensagens`, {
    method: "POST",
    body: JSON.stringify({ remetenteId, conteudo }),
  });

export const listarMensagens = async (chatId, usuarioId) =>
  request(`/chats/${chatId}/mensagens?usuarioId=${usuarioId}`);

export const excluirChat = async (chatId) =>
  request(`/chats/${chatId}`, { method: "DELETE" });
