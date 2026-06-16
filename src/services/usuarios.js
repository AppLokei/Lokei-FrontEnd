import { request } from "./http";

// Converte a data do input HTML (YYYY-MM-DD) para o formato exigido
// pela API de validacao de CPF (DD/MM/AAAA).
const formatarDataBr = (dataIso = "") => {
    const [ano, mes, dia] = dataIso.split("-");
    return ano && mes && dia ? `${dia}/${mes}/${ano}` : "";
};

export const cadastrarUsuario = async ({
    nome,
    email,
    cpf,
    telefone,
    senha,
    dataNascimento,
    cep,
    logradouro,
    numero,
    bairro,
    cidade,
    estado,
} = {}) => {
    const numeroInt = Number.parseInt(numero, 10);
    const dataNasc = formatarDataBr(dataNascimento);
    const query = dataNasc ? `?data=${encodeURIComponent(dataNasc)}` : "";

    return request(`/usuario/cadastro${query}`, {
        method: "POST",
        body: JSON.stringify({
            nome,
            email,
            cpf,
            telefone,
            senha,
            endereco: {
                cep,
                logradouro,
                numero: Number.isNaN(numeroInt) ? null : numeroInt,
                bairro,
                cidade,
                estado,
            },
        }),
    });
};

export const atualizarPerfil = async (id, dados) =>
    request(`/usuario/${id}`, {
        method: "PUT",
        body: JSON.stringify(dados),
    });
