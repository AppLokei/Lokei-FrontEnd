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

export const buscarUsuarioPorId = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error("Usuário não encontrado.");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};
