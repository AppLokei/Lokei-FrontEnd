const API_URL = "/api";

const parseBody = async (response) => {
  if (response.status === 204) return null;

  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const request = async (path, options = {}) => {
  const userId = localStorage.getItem("lokei_user_id");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(userId ? { "X-User-Id": userId } : {}),
      ...(options.headers ?? {}),
    },
  });

  const body = await parseBody(response);

  if (!response.ok) {
    const message =
      (body && typeof body === "object" && (body.mensagem || body.message || body.error || body.erro)) ||
      (typeof body === "string" ? body : null) ||
      `Erro na requisicao (${response.status})`;

    throw new Error(message);
  }

  return body;
};

export { API_URL };
