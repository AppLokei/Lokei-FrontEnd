import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import CampoEntrada from "../components/Input";
import Botao from "../components/Button";
import ConfirmationModal from "../components/ConfirmationModal";
import "./Cadastro.css";

const Cadastro = () => {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [aceiteTermos, setAceiteTermos] = useState(false);
  const [erros, setErros] = useState({});
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const navigate = useNavigate();

  const formatarCpf = (valor) => {
    const digitos = valor.replace(/\D/g, "").slice(0, 11);
    const parte1 = digitos.slice(0, 3);
    const parte2 = digitos.slice(3, 6);
    const parte3 = digitos.slice(6, 9);
    const parte4 = digitos.slice(9, 11);

    if (digitos.length <= 3) return parte1;
    if (digitos.length <= 6) return `${parte1}.${parte2}`;
    if (digitos.length <= 9) return `${parte1}.${parte2}.${parte3}`;
    return `${parte1}.${parte2}.${parte3}-${parte4}`;
  };

  const handleCpfChange = (evento) => {
    const cpfFormatado = formatarCpf(evento.target.value);
    setCpf(cpfFormatado);
  };

  const validar = () => {
    const proximosErros = {};
    const cpfDigitos = cpf.replace(/\D/g, "");

    if (!nomeCompleto.trim()) {
      proximosErros.nomeCompleto = "Informe seu nome completo.";
    }
    
    if (!dataNascimento.trim()) {
      proximosErros.dataNascimento = "Informe sua data de nascimento.";
    }

    if (!email.includes("@")) {
      proximosErros.email = "Digite um e-mail valido.";
    }

    if (cpfDigitos.length !== 11) {
      proximosErros.cpf = "CPF deve ter 11 digitos numericos.";
    }

    if (!telefone.trim()) {
      proximosErros.telefone = "Informe seu telefone.";
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(senha)) {
      proximosErros.senha =
        "Senha precisa ter 8+ caracteres com letras e numeros.";
    }

    if (confirmarSenha !== senha) {
      proximosErros.confirmarSenha = "As senhas nao conferem.";
    }

    if (!aceiteTermos) {
      proximosErros.aceiteTermos =
        "Voce precisa aceitar os Termos e Politica de Privacidade.";
    }
    
    if (!cep.trim()) proximosErros.cep = "Campo obrigatório.";
    if (!logradouro.trim()) proximosErros.logradouro = "Campo obrigatório.";
    if (!numero.trim()) proximosErros.numero = "Campo obrigatório.";
    if (!bairro.trim()) proximosErros.bairro = "Campo obrigatório.";
    if (!cidade.trim()) proximosErros.cidade = "Campo obrigatório.";
    if (!estado.trim()) proximosErros.estado = "Campo obrigatório.";

    return proximosErros;
  };

  const [modalErroAberto, setModalErroAberto] = useState(false);
  const [mensagemModalErro, setMensagemModalErro] = useState("");

  const handleSubmit = async (evento) => {
    evento.preventDefault();
    const proximosErros = validar();
    setErros(proximosErros);

    if (Object.keys(proximosErros).length > 0) {
      setMensagemModalErro("Por favor, preencha corretamente todos os campos obrigatórios.");
      setModalErroAberto(true);
      return;
    }

    try {
      const { cadastrarUsuario } = await import("../services");
      const cpfDigitos = cpf.replace(/\D/g, "");
      const telefoneDigitos = telefone.replace(/\D/g, "");
      const cepDigitos = cep.replace(/\D/g, "");
      
      await cadastrarUsuario({
        nome: nomeCompleto,
        email,
        cpf: cpfDigitos,
        telefone: telefoneDigitos,
        senha,
        cep: cepDigitos,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado
      });
      
      alert("Cadastro realizado com sucesso! Faça login para continuar.");
      navigate("/login");
    } catch (err) {
      setMensagemModalErro(err.message || "Ocorreu um erro inesperado ao tentar realizar o cadastro.");
      setModalErroAberto(true);
    }
  };

  return (
    <div className="cadastroPage">
      <div className="cadastroSplit">
        <section className="cadastroBrand">
          <div className="cadastroBrandInner">
            <img className="cadastroBrandLogo" src="/logo-transparent.png" alt="Lokei Logo" />
            <h1 className="cadastroBrandTitle">
              Alugue ferramentas com seguranca, clareza e diaria transparente.
            </h1>
            <p className="cadastroBrandSubtitle">
              Uma conta so. Reserva rapida, combinacao facil e suporte quando precisar.
            </p>
          </div>
        </section>

        <section className="cadastroFormPanel">
          <header className="cadastroHeader">
            <p className="cadastroEyebrow">Crie sua conta</p>
            <h2 className="cadastroTitle">Comece a alugar hoje</h2>
            <p className="cadastroSubtitle">
              Organize seus dados em duas etapas simples.
            </p>
          </header>

          <form className="cadastroForm" onSubmit={handleSubmit}>
            <div className="cadastroSection">
              <div className="cadastroSectionHeader">
                <p className="cadastroSectionTitle">1. Dados Pessoais</p>
                <span className="cadastroSectionHint">Dados para identificar sua conta.</span>
              </div>
              <div className="cadastroFieldGroup">
                <CampoEntrada
                  rotulo="Nome Completo"
                  name="nomeCompleto"
                  placeholder="Seu nome"
                  value={nomeCompleto}
                  onChange={(evento) => setNomeCompleto(evento.target.value)}
                  erro={erros.nomeCompleto}
                  obrigatorio
                />
                <CampoEntrada
                  rotulo="Data de Nascimento"
                  name="dataNascimento"
                  type="date"
                  value={dataNascimento}
                  onChange={(evento) => setDataNascimento(evento.target.value)}
                  erro={erros.dataNascimento}
                  obrigatorio
                />
                <CampoEntrada
                  rotulo="E-mail"
                  name="email"
                  type="email"
                  placeholder="voce@email.com"
                  value={email}
                  onChange={(evento) => setEmail(evento.target.value)}
                  erro={erros.email}
                  obrigatorio
                />
                <CampoEntrada
                  rotulo="CPF"
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={handleCpfChange}
                  inputMode="numeric"
                  erro={erros.cpf}
                  obrigatorio
                />
                <CampoEntrada
                  rotulo="Telefone"
                  name="telefone"
                  placeholder="(11) 99999-9999"
                  value={telefone}
                  onChange={(evento) => setTelefone(evento.target.value)}
                  erro={erros.telefone}
                  obrigatorio
                />
                <CampoEntrada
                  rotulo="Senha"
                  name="senha"
                  type="password"
                  placeholder="Crie uma senha"
                  value={senha}
                  onChange={(evento) => setSenha(evento.target.value)}
                  erro={erros.senha}
                  obrigatorio
                />
                <CampoEntrada
                  rotulo="Confirmar Senha"
                  name="confirmarSenha"
                  type="password"
                  placeholder="Repita sua senha"
                  value={confirmarSenha}
                  onChange={(evento) => setConfirmarSenha(evento.target.value)}
                  erro={erros.confirmarSenha}
                  obrigatorio
                />
              </div>
            </div>

            <div className="cadastroSection">
              <div className="cadastroSectionHeader">
                <p className="cadastroSectionTitle">2. Endereco</p>
                <span className="cadastroSectionHint">Use o endereco para entregas e retiradas.</span>
              </div>
              <div className="cadastroFieldGroup">
                <CampoEntrada rotulo="CEP" name="cep" placeholder="00000-000" value={cep} onChange={(e) => setCep(e.target.value)} erro={erros.cep} obrigatorio />
                <CampoEntrada rotulo="Logradouro" name="logradouro" placeholder="Rua, avenida" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} erro={erros.logradouro} obrigatorio />
                <div className="cadastroFieldRow">
                  <CampoEntrada rotulo="Numero" name="numero" placeholder="Numero" value={numero} onChange={(e) => setNumero(e.target.value)} erro={erros.numero} obrigatorio />
                  <CampoEntrada rotulo="Complemento" name="complemento" placeholder="Apartamento, bloco" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
                </div>
                <CampoEntrada rotulo="Bairro" name="bairro" placeholder="Seu bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} erro={erros.bairro} obrigatorio />
                <div className="cadastroFieldRow">
                  <CampoEntrada rotulo="Cidade" name="cidade" placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} erro={erros.cidade} obrigatorio />
                  <CampoEntrada rotulo="Estado" name="estado" placeholder="UF" value={estado} onChange={(e) => setEstado(e.target.value)} erro={erros.estado} obrigatorio />
                </div>
              </div>
            </div>

            <div>
              <label className="cadastroTerms">
                <input
                  type="checkbox"
                  checked={aceiteTermos}
                  onChange={(evento) => setAceiteTermos(evento.target.checked)}
                />
                <span>
                  Concordo com os Termos de Uso e Politica de Privacidade.
                </span>
              </label>
              {erros.aceiteTermos ? (
                <div className="cadastroTermsError">{erros.aceiteTermos}</div>
              ) : null}
            </div>

            <div className="cadastroActions">
              <Botao type="submit">Cadastrar</Botao>
              <Link className="cadastroLink" to="/login">
                Ja tenho conta
              </Link>
            </div>
          </form>
        </section>
      </div>

      <ConfirmationModal
        aberto={modalErroAberto}
        aoFechar={() => setModalErroAberto(false)}
        aoConfirmar={() => setModalErroAberto(false)}
        titulo="Erro no Cadastro"
        descricao={mensagemModalErro}
        textoConfirmar="Entendi"
        varianteConfirmar="outlineRed"
      />
    </div>
  );
};

export default Cadastro;
