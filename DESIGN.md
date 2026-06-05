---
name: Lokei
description: Marketplace de aluguel de ferramentas com foco em clareza e confianca.
colors:
  amarelo-acao: "#f0b429"
  amarelo-acao-deep: "#e0a420"
  bege-areia: "#fff7e7"
  marfim-matizado: "#f8f7f4"
  branco-calmo: "#fafafa"
  branco-brilhante: "#ffffff"
  grafite-escuro: "#1f1f1f"
  grafite-solido: "#1a1a1a"
  cinza-texto: "#6b6b6b"
  cinza-apoio: "#4b4b4b"
  cinza-frio: "#9ca3af"
  cinza-borda: "#d9d9d9"
  cinza-borda-suave: "#e5e7eb"
  cinza-fundo: "#f3f4f6"
  vermelho-alerta: "#d64545"
  vermelho-alerta-escuro: "#c63737"
  verde-sucesso: "#2f7a34"
  verde-sucesso-tinta: "#dcfce7"
  amarelo-suave: "#fef3c7"
  vermelho-suave: "#fee2e2"
  ocre-acao: "#9b6b00"
  ocre-acao-escuro: "#8a6a00"
  ocre-apoio: "#92400e"
  ardosia: "#4b5563"
typography:
  display:
    fontFamily: "Poppins, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1.6rem, 2vw + 1rem, 2.2rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Poppins, system-ui, -apple-system, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "Poppins, system-ui, -apple-system, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Poppins, system-ui, -apple-system, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "Poppins, system-ui, -apple-system, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 600
    letterSpacing: "0.01em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "14px"
  xl: "18px"
  xxl: "24px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "14px"
  lg: "18px"
  xl: "24px"
  xxl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.amarelo-acao}"
    textColor: "{colors.grafite-solido}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  button-secondary:
    backgroundColor: "{colors.cinza-fundo}"
    textColor: "{colors.ardosia}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  button-outline-yellow:
    backgroundColor: "transparent"
    textColor: "{colors.ocre-acao}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  input-default:
    backgroundColor: "{colors.branco-brilhante}"
    textColor: "{colors.grafite-escuro}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
  card-default:
    backgroundColor: "{colors.branco-brilhante}"
    textColor: "{colors.grafite-escuro}"
    rounded: "{rounded.xl}"
    padding: "14px"
---

# Design System: Lokei

## 1. Overview

**Creative North Star: "Oficina Clara"**

Lokei combina a praticidade de uma oficina organizada com a clareza de um balcão bem iluminado. A interface e direta e confiavel, com ritmo tipografico firme e uso cuidadoso de espaco em branco para priorizar conteudo, imagens e decisao. O visual privilegia leitura rapida, contraste seguro e uma sensacao de ordem sem frieza.

Rejeita explicitamente o padrao de SaaS generico e a linguagem de classificados tradicionais. Nada de gradientes decorativos, cards aninhados, fontes Inter ou Roboto, ou layouts poluidos que competem pela atencao.

**Key Characteristics:** clareza funcional, calor discreto, hierarquia consistente, imagens como prova.

## 2. Colors

Palette quente e neutra, com o amarelo como acao e acentos de sinalizacao claros.

### Primary
- **Amarelo Acao** (#f0b429): CTA principal, destaques de acao e foco visual controlado.

### Secondary
- **Ocre Acao** (#9b6b00): links ativos, tags de apoio e estados selecionados.

### Neutral
- **Bege Areia** (#fff7e7): fundo suave em paginas e hero.
- **Marfim Matizado** (#f8f7f4): transicao de fundo e areas de descanso.
- **Branco Brilhante** (#ffffff): superfices de cards e paineis.
- **Branco Calmo** (#fafafa): hover e areas secundarias.
- **Grafite Escuro** (#1f1f1f): texto principal e titulos.
- **Cinza Texto** (#6b6b6b): texto secundario e microcopy.
- **Cinza Borda Suave** (#e5e7eb): divisores e linhas de separacao.
- **Cinza Borda** (#d9d9d9): contornos discretos em inputs.

### Named Rules
**The Commitment Rule.** O amarelo acao aparece em 30 a 60% das areas de acao, nunca como fundo geral.

## 3. Typography

**Display Font:** Poppins (fallback system-ui)
**Body Font:** Poppins (fallback system-ui)

**Character:** tipografia solida, clara e moderna, com peso suficiente para transmitir confianca.

### Hierarchy
- **Display** (700, clamp(1.6rem, 2vw + 1rem, 2.2rem), line-height 1.2): titulos principais.
- **Headline** (700, 1.35rem, line-height 1.25): subtitulos e chamadas internas.
- **Title** (700, 1.1rem, line-height 1.3): headers de secao.
- **Body** (500, 0.95rem, line-height 1.5): texto padrao, limitar a 65-75ch.
- **Label** (600, 0.85rem, 0.01em): labels, badges e navegacao.

### Named Rules
**The Clear Step Rule.** Cada nivel sobe ao menos 1.25x em tamanho e 1 nivel de peso.

## 4. Elevation

Sistema de sombras suaves e tacteis. A elevacao e usada para separar superfices interativas do fundo e para indicar foco ou hover, sem exagero.

### Shadow Vocabulary
- **Ambient soft** (`box-shadow: 0 10px 20px rgba(24, 24, 24, 0.10)`): botoes e icones.
- **Card lift** (`box-shadow: 0 18px 35px rgba(24, 24, 24, 0.08)`): cards de ferramentas e listas.
- **Panel lift** (`box-shadow: 0 24px 50px rgba(24, 24, 24, 0.08)`): modais e cards de login.
- **Focus ring** (`box-shadow: 0 0 0 3px rgba(240, 180, 41, 0.2)`): foco em inputs.

### Named Rules
**The Tactile Rule.** Sombras aparecem para sinalizar interacao, nao decoracao.

## 5. Components

### Buttons
- **Shape:** cantos suaves (14px).
- **Primary:** fundo amarelo acao, texto grafite, padding 12px 16px.
- **Hover / Focus:** leve elevacao e escurecimento do amarelo.
- **Secondary:** cinza claro com borda, sem sombra.

### Cards / Containers
- **Corner Style:** 18px para cards, 24px para paineis.
- **Background:** branco brilhante sobre fundo bege/marfim.
- **Shadow Strategy:** usar sombras suaves da secao Elevation.
- **Border:** borda sutil com amarelo translucido quando necessario.
- **Internal Padding:** 12px a 18px, variando por densidade.

### Inputs / Fields
- **Style:** borda fina, fundo branco, radius 12px.
- **Focus:** ring amarelo suave (0 0 0 3px rgba(240, 180, 41, 0.2)).
- **Error / Disabled:** vermelho alerta e cinza desativado.

### Navigation
- **Mobile:** barra inferior em forma de pilula, com item ativo em amarelo transluscido.
- **Desktop:** header fixo com borda inferior e realce discreto no hover.

## 6. Do's and Don'ts

### Do:
- **Do** manter o amarelo acao como destaque de CTA e estados ativos.
- **Do** usar fundos quentes com degradacao suave apenas como base estrutural.
- **Do** usar imagens grandes e limpas nas listagens.

### Don't:
- **Don't** usar templates genericos de SaaS ou padroes de "AI slop".
- **Don't** usar Inter ou Roboto como tipografia.
- **Don't** usar cards aninhados dentro de cards.
- **Don't** criar layouts amontoados no estilo de classificados tradicionais.
