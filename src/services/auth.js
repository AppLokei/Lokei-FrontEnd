const API_URL = "/api/auth";

export const login = async (email, senha) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, senha }),
        });

        if (!response.ok) {
            throw new Error("E-mail ou senha incorretos.");
        }

        const data = await response.json();
        return data; // { id, nome, email, cpf, telefone, role }
    } catch (error) {
        throw error;
    }
};

export const cadastrarUsuario = async (dados) => {
    try {
        const response = await fetch(`${API_URL}/registro`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dados),
        });

        if (!response.ok) {
            throw new Error("Erro ao criar a conta. Verifique os dados.");
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};
