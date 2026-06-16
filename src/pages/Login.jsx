import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginService } from "../services/auth";
import { buscarUsuarioPorId } from "../services/usuarios";

import CampoEntrada from "../components/Input";
import Botao from "../components/Button";
import "./Login.css";

const Login = () => {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validar = () => {
    const proximosErros = {};
    if (!login.trim()) {
      proximosErros.login = "Informe seu e-mail.";
    } else if (!login.includes("@")) {
      proximosErros.login = "Digite um e-mail valido.";
    }

    if (!senha.trim()) {
      proximosErros.senha = "Digite sua senha.";
    }

    return proximosErros;
  };

  const handleSubmit = async (evento) => {
    evento.preventDefault();
    const proximosErros = validar();
    setErros(proximosErros);

    if (Object.keys(proximosErros).length > 0) return;

    try {
      setLoading(true);
      const data = await loginService(login, senha);
      const usuario = data.usuario ?? {};
      const userId = usuario.id;

      localStorage.setItem("lokei_user_id", userId);
      localStorage.setItem("lokei_nome", usuario.nome ?? "");
      localStorage.setItem("lokei_email", usuario.email ?? "");
      if (data.token) localStorage.setItem("lokei_token", data.token);

      // O login retorna apenas id/nome/email; busca o perfil completo
      // para preencher telefone, cpf e endereco.
      try {
        const perfil = await buscarUsuarioPorId(userId);
        const endereco = perfil.endereco ?? {};

        localStorage.setItem("lokei_telefone", perfil.telefone ?? "");
        localStorage.setItem("lokei_cpf", perfil.cpf ?? "");

        localStorage.setItem(`lokei_nome_${userId}`, perfil.nome ?? "");
        localStorage.setItem(`lokei_email_${userId}`, perfil.email ?? "");
        localStorage.setItem(`lokei_telefone_${userId}`, perfil.telefone ?? "");
        localStorage.setItem(`lokei_cpf_${userId}`, perfil.cpf ?? "");
        localStorage.setItem(`lokei_cep_${userId}`, endereco.cep ?? "");
        localStorage.setItem(`lokei_logradouro_${userId}`, endereco.logradouro ?? "");
        localStorage.setItem(`lokei_numero_${userId}`, endereco.numero ?? "");
        localStorage.setItem(`lokei_bairro_${userId}`, endereco.bairro ?? "");
        localStorage.setItem(`lokei_cidade_${userId}`, endereco.cidade ?? "");
        localStorage.setItem(`lokei_estado_${userId}`, endereco.estado ?? "");
      } catch (e) {
        // Se a busca do perfil falhar, segue com os dados basicos do login.
      }

      navigate("/");
      window.location.reload(); // Para forçar atualização do menu de navegação com os dados reais
    } catch (error) {
      setErros({ geral: "E-mail ou senha incorretos." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginPage">
      <div className="loginSplit">
        <section className="loginBrand">
          <div className="loginBrandInner">
            <img className="loginBrandLogo" src="/logo-transparent.png" alt="Lokei Logo" />
            <h1 className="loginBrandTitle">
              Alugue as ferramentas que voce precisa, quando precisar.
            </h1>
            <p className="loginBrandSubtitle">
              Tudo o que voce precisa para projetos rapidos, com diaria clara e retirada facil.
            </p>
          </div>
        </section>

        <section className="loginFormPanel">
          <header className="loginHeader">
            <p className="loginEyebrow">Acesse sua conta</p>
            <h2 className="loginTitle">Bem-vindo de volta</h2>
            <p className="loginSubtitle">Entre para continuar alugando.</p>
          </header>

          <form className="loginForm" onSubmit={handleSubmit}>
            {erros.geral && (
              <div style={{ padding: "10px", background: "#ffebee", color: "#c62828", borderRadius: "8px", marginBottom: "15px", fontSize: "14px", fontWeight: "bold" }}>
                {erros.geral}
              </div>
            )}
            <CampoEntrada
              rotulo="E-mail"
              name="login"
              placeholder="Digite seu email@dominio.com"
              value={login}
              onChange={(evento) => setLogin(evento.target.value)}
              erro={erros.login}
            />
            <p className="loginPrivacy">Seus dados sao protegidos e nunca compartilhados.</p>
            <CampoEntrada
              rotulo="Senha"
              name="senha"
              type={mostrarSenha ? "text" : "password"}
              placeholder="Digite sua senha"
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
              erro={erros.senha}
              acao={
                <button
                  type="button"
                  className="inputActionButton"
                  onClick={() => setMostrarSenha((prev) => !prev)}
                >
                  {mostrarSenha ? "Ocultar" : "Mostrar"}
                </button>
              }
            />

            <Botao type="submit" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
            </Botao>
          </form>

          <div className="loginFooter">
            Ainda nao tem conta? <Link to="/cadastro">Cadastre-se</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
