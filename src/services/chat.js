import { request } from "./http";

export const iniciarChat = async (aluguelId) =>
  request(`/alugueis/${aluguelId}/chat`);

export const listarChats = async () =>
  request(`/chats`);

export const enviarMensagem = async (chatId, { conteudo }) =>
  request(`/chats/${chatId}/mensagens`, {
    method: "POST",
    body: JSON.stringify({ conteudo }),
  });

export const listarMensagens = async (chatId) =>
  request(`/chats/${chatId}`);

export const excluirChat = async (chatId) =>
  request(`/chats/${chatId}`, { method: "DELETE" });
