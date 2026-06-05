---
target: src/pages/Login.jsx
total_score: 21
p0_count: 2
p1_count: 2
timestamp: 2026-05-26T18-46-51Z
slug: src-pages-login-jsx
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Sem feedback de envio ou progresso. |
| 2 | Match System / Real World | 2 | Falta contexto de marketplace; parece SaaS generico. |
| 3 | User Control and Freedom | 2 | Links secundarios sem hierarquia clara. |
| 4 | Consistency and Standards | 2 | Padrao visual conflita com DESIGN.md (cartao centralizado). |
| 5 | Error Prevention | 2 | Regras de CPF/email pouco claras; placeholder so email. |
| 6 | Recognition Rather Than Recall | 3 | Labels existem, mas falta guia para CPF. |
| 7 | Flexibility and Efficiency | 2 | Sem atalhos, sem contexto rapido. |
| 8 | Aesthetic and Minimalist Design | 3 | Limpo, mas generico e sem ancoragem visual. |
| 9 | Error Recovery | 2 | Erros existem, mas sem sugestoes claras. |
| 10 | Help and Documentation | 1 | Sem ajuda contextual para CPF ou senha. |
| **Total** | | **21/40** | **Acceptable** |

#### Anti-Patterns Verdict

**LLM assessment**: O cartao centralizado isolado e o visual de template SaaS sao exatamente o antipadrao banido no DESIGN.md. Falta assimetria, contexto e personalidade de marketplace.

**Deterministic scan**: Detector indisponivel (bundled detector not found). Sem contagem automatica.

**Visual overlays**: Nao disponivel porque o detector falhou.

#### Overall Impression

Funciona, mas parece um login genérico de SaaS. A oportunidade e transformar em uma entrada com identidade de marketplace premium: layout assimétrico/split screen, hierarquia tipografica clara e CTA principal dominante.

#### What's Working

- Paleta respeita amarelo/bege/neutros.
- Formulario curto e direto.
- Labels presentes e legiveis.

#### Priority Issues

- **P0 — Cartao centralizado generico**
  - **Why it matters**: Vai contra o DESIGN.md e passa impressao de template.
  - **Fix**: Migrar para split screen ou layout assimetrico, com painel de marca/beneficio e formulario alinhado lateralmente.
  - **Suggested command**: `impeccable layout`.

- **P0 — Hierarquia tipografica achatada**
  - **Why it matters**: Titulo, subtitulo, labels e links competem em peso visual.
  - **Fix**: Aumentar contraste entre titulo/subtitulo e reduzir destaque de links secundarios; aplicar escala consistente.
  - **Suggested command**: `impeccable typeset`.

- **P1 — Links secundarios competem com CTA**
  - **Why it matters**: Esqueci senha e Cadastre-se aparecem quase com o mesmo peso do CTA.
  - **Fix**: Tornar “Esqueci minha senha” um link discreto e “Cadastre-se” um callout menor, mantendo o CTA como foco.
  - **Suggested command**: `impeccable polish`.

- **P1 — Falta de contexto de marketplace premium**
  - **Why it matters**: Sem prova visual, o login perde confianca.
  - **Fix**: Inserir area de marca/beneficio com imagem de ferramenta, promessa curta e provas (ex: avaliacao media).
  - **Suggested command**: `impeccable layout`.

#### Persona Red Flags

**Jordan (First-Timer)**: Nao entende se pode usar CPF; placeholder so email gera duvida.

**Casey (Distracted Mobile User)**: Card pequeno e centralizado; CTA nao domina o primeiro olhar.

#### Minor Observations

- Logo textual poderia ser substituida por logo real.
- Copy de subtitulo poderia reforcar confianca/seguranca.
- Falta de microcopy de privacidade para CPF.

#### Questions to Consider

- Split screen com imagem de ferramenta e promessa do lado esquerdo faz sentido para voce?
- O link “Esqueci minha senha” deve ficar abaixo do CTA, como texto simples?
- Quer inserir um bloco pequeno de confianca (avaliacao media, numero de alugueis) na tela?
