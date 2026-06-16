import { request } from "./http";

const PALAVRAS_MINUSCULAS = new Set(["e", "de"]);

const rotuloCategoria = (valor = "") =>
  valor
    .toLowerCase()
    .split("_")
    .map((parte) =>
      PALAVRAS_MINUSCULAS.has(parte)
        ? parte
        : parte.charAt(0).toUpperCase() + parte.slice(1),
    )
    .join(" ");

export async function buscarCategorias() {
  const data = await request("/categorias");
  const lista = Array.isArray(data) ? data : [];

  return lista.map((valor) => ({
    id: valor,
    nome: rotuloCategoria(valor),
  }));
}
