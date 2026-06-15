const API_URL = "/api/usuarios";

export const atualizarPerfil = async (id, dados) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dados),
        });

        if (!response.ok) {
            throw new Error("Erro ao atualizar o perfil.");
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};
