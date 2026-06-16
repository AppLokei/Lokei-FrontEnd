const API_URL = "/api";

export const atualizarPerfil = async (id, dados) => {
    try {
        const token = localStorage.getItem("lokei_token");
        const response = await fetch(`${API_URL}/perfil`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
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
        const token = localStorage.getItem("lokei_token");
        const response = await fetch(`${API_URL}/perfil`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error("Usuário não encontrado.");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};
