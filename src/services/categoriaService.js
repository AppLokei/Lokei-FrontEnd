export async function buscarCategorias() {
  const response = await fetch("http://localhost:8080/categorias");

  if (!response.ok) {
    throw new Error("Erro ao buscar categorias");
  }

  return response.json();
}
