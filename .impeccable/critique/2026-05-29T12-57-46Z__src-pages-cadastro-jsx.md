---
target: src/pages/Cadastro.jsx
total_score: 19
p0_count: 1
p1_count: 3
timestamp: 2026-05-29T12-57-46Z
slug: src-pages-cadastro-jsx
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Sem indicacao de progresso para formulario longo |
| 2 | Match System / Real World | 2 | Fluxo nao separa Dados Pessoais e Endereco |
| 3 | User Control and Freedom | 2 | Sem alternativa para endereco depois |
| 4 | Consistency and Standards | 2 | Diverge do split-screen do Login |
| 5 | Error Prevention | 2 | Erros so aparecem ao enviar; faltam guias previas |
| 6 | Recognition Rather Than Recall | 1 | Sem titulos de secao, o usuario precisa lembrar o que ja preencheu |
| 7 | Flexibility and Efficiency | 2 | Sem autofill ou agrupamento para rapidez |
| 8 | Aesthetic and Minimalist Design | 1 | Cartao centralizado e visual generico |
| 9 | Error Recovery | 2 | Erros existem, mas sem agrupamento por secao |
| 10 | Help and Documentation | 3 | Termos existem, mas sem contexto adicional |
| **Total** | | **19/40** | **Poor** |

#### Anti-Patterns Verdict

**Start here.** Parece template. O cartao centralizado com gradiente e badge generico entra no anti-padrao que o design do produto rejeita.

**LLM assessment**: A pagina usa um unico cartao branco centralizado que contrasta com o padrao split-screen do Login. Isso quebra consistencia e identidade. A base termina em branco puro e nao usa OKLCH.

**Deterministic scan**: indisponivel. O detector falhou ao carregar (bundled detector not found), portanto nenhum achado automatico.

#### Overall Impression
O fluxo funciona, mas a apresentacao e um template padrao. O maior ganho vem de alinhar ao split-screen e estruturar o formulario em blocos claros para reduzir medo com os novos campos.

#### What's Working
- Validacao de CPF ajuda na qualidade dos dados.
- Copy e direta e compreensivel.
- Estrutura simples facilita ajustes futuros.

#### Priority Issues
- **[P0] Anti-padrao de cartao centralizado**
  - **Why it matters**: quebra a consistencia com o Login e passa sensacao de template.
  - **Fix**: migrar para split-screen: coluna esquerda de contexto/beneficios, coluna direita com o formulario.
  - **Suggested command**: `impeccable layout`
- **[P1] Carga cognitiva alta para novos campos**
  - **Why it matters**: mais campos sem organizacao aumenta abandono.
  - **Fix**: dividir em seccoes com titulos: "Dados Pessoais" e "Endereco"; inserir divisores e espacamento.
  - **Suggested command**: `impeccable layout`
- **[P1] Paleta e fundo fora das diretrizes**
  - **Why it matters**: gradiente com branco puro contradiz a identidade.
  - **Fix**: usar fundo beige/marfim em OKLCH e superficies matizadas, mantendo amarelo para CTA.
  - **Suggested command**: `impeccable colorize`
- **[P1] Sem indicacao de progresso**
  - **Why it matters**: com formulario maior, usuario nao sabe quanto falta.
  - **Fix**: adicionar divisores com numeracao simples (1. Dados Pessoais, 2. Endereco) ou barra sutil.
  - **Suggested command**: `impeccable layout`

#### Persona Red Flags
**Jordan (First-Timer)**: lista longa sem agrupamento, nao sabe onde esta no fluxo.

**Casey (Mobile)**: formulario extenso em unico bloco aumenta fadiga e abandono no meio.

**Alex (Power User)**: sem estrutura nem atalhos, parece lento e burocratico.

#### Minor Observations
- Badge "Cadastro Lokei" adiciona pouco valor.
- Termos ficam visiveis, mas sem contextualizacao.
- Largura curta aumenta scroll e sensacao de peso.

#### Questions to Consider
- O endereco precisa mesmo no cadastro, ou pode entrar no primeiro aluguel?
- Qual o minimo de dados para criar valor nos primeiros 60 segundos?
- O split-screen do Login tem algum elemento reutilizavel para reforcar consistencia?
