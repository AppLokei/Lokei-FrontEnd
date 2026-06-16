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
    const payload = {
        nome: dados.nome,
        email: dados.email,
        cpf: dados.cpf,
        telefone: dados.telefone,
        senha: dados.senha,
        aceitouTermos: true,
        papel: "LOCATARIO",
        endereco: {
            cep: dados.cep,
            logradouro: dados.logradouro,
            numero: dados.numero,
            complemento: dados.complemento,
            bairro: dados.bairro,
            cidade: dados.cidade,
            estado: dados.estado
        }
    };

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.mensagem || "Erro ao criar a conta. Verifique os dados.");
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};
